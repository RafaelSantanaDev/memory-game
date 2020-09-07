let secondsHtml = document.querySelector('#seconds');
let minutesHtml = document.querySelector('#minutes');
let hoursHtml = document.querySelector('#hours');
let countdown = document.querySelector('.countdown');

count_stars = 3;
count = 6;

/**
 * Inicializa o contador de contagem regressiva para começar o jogo.
 */
function start_countdown(){
    if((count - 1) >= 0){
        count -= 1;
        countdown.innerHTML = count;
        setTimeout('start_countdown();', 1000);
    } else {
        countdown.style.display = 'none';
    }
}

/**
 * Inicializa o cronômetro zerando as variaveis de Horas, Minutos e Segundos.
 * Insere os valores acima no HTML.
 */
function startStopwatch(){
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    interval = setInterval(function(){
        if(seconds == 60) { minutes++; seconds = 0; }
        if(minutes == 60) { hours++; minutes = 0; seconds = 0; }

        hours < 10 ? hoursHtml.innerHTML = "0"+hours : hoursHtml.innerHTML = hours;
        minutes < 10 ? minutesHtml.innerHTML = "0"+minutes : minutesHtml.innerHTML = minutes;
        seconds < 10 ? secondsHtml.innerHTML = "0"+seconds : secondsHtml.innerHTML = seconds;
        seconds++;     
    
    }, 1000);
}

/**
 * Para o cronômetro
 * @return time Tempo em que o cronômetro foi parado.
 */
function stopStopwatch(){
    clearInterval(interval);
    let time = `${hoursHtml.textContent} : ${minutesHtml.textContent} : ${secondsHtml.textContent}`;
    return time;
}


/**
 * Lista de icones para ser embaralhada
 */
let cards = [
    'fa-gem', 'fa-gem',
    'fa-cat', 'fa-cat',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'
];
/**
 * Contador/Pontuação
 */
let moves = document.querySelector('.count');
let openCards = [];

/**
 * Template para criação dos cards
 * @param {string} card O valor do card é um dos valores contidos no array cards
 */
function createCard(card){
    return `<li class="card animated open" data-card="${card}"><i class="fa ${card} fa-2x"></i></li>`;
}

/**
 * Embaralha o array de cards
 * @param {array} array 
 */
function shuffle(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
 
    return array;
}

/**
 * Finaliza o jogo parando o timer, e exibindo a pontuação para o usuário
 */
function endGame(){
    let time = stopStopwatch();
    document.querySelector('.content').style.display = "none";
    document.querySelector('.endGame').style.display = "block";

    document.querySelector('.title_endGame').textContent = "Parabéns!! Você venceu!!";
    document.querySelector('.text_endGame').textContent = `
        Realizou ${moves.textContent} jogadas, 
        Recebeu ${count_stars} estrelas,
        em ${time} `;
}

/**
 * Função responsável por inicializar.
 * Embaralha a lista de cartas com a função shuffle e com o resultado cria e adiciona os cards dentro do deck
 */
function startGame(){
    let deck = document.querySelector('.deck');
    
    // Embralha as cartas
    let cardHTML = shuffle(cards).map(function(card){
        return createCard(card);
    });

    // Insere as cartas embaralhas no HTML.
    deck.innerHTML = cardHTML.join('');
    
    // Inicializa variaveis para controle do jogo.
    moves.textContent = 0;
    openCards = [];
    matchCards = [];

    let allCards = document.querySelectorAll('.card');
    
    setTimeout(() => {
        startStopwatch();
    }, 2000);

    // Seleciona todos os cards, deixando com os icones visiveis por 3 segundos.
    allCards.forEach(function(card){
        setTimeout(function(){
            resetCard(card);
            // Adiciona evento de click para cada carta no deck.
            card.addEventListener('click', function(e){
                if(!card.classList.contains('open')){
                    iconCard = card.children[0]; 
                    iconCard.classList.remove('invisible');
                    card.classList.add('open');
                    openCards.push(card);
                    
                    // Verifica se foram abertas duas cartas.
                    if(openCards.length == 2){
                        ++moves.textContent;
                        
                        // Verifica a quantidade de movimentos para poder "elimitar" uma estrela.
                        if(moves.textContent == 18){
                            let star = document.querySelector('#third_star');
                            --count_stars;
                            star.classList.remove('fas', 'fa-2x');
                            star.classList.add('far');
                        }
                         // Verifica a quantidade de movimentos para poder "elimitar" uma estrela.
                        if(moves.textContent == 20){
                            let star = document.querySelector('#second_star');
                            --count_stars;
                            star.classList.remove('fas', 'fa-2x');
                            star.classList.add('far');
                        }
                         // Verifica a quantidade de movimentos para poder "elimitar" uma estrela.
                        if(moves.textContent == 22){
                            let star = document.querySelector('#first_star');
                            --count_stars;
                            star.classList.remove('fas', 'fa-2x');
                            star.classList.add('far');
                        }

                        // Compara se as carts abertas são iguais através de seus icones.
                        if(openCards[0].dataset.card == openCards[1].dataset.card){
                            openCards.forEach(function(card){
                                card.classList.add('match', 'tada');
                                matchCards.push(card);
                            });
                            openCards = [];
                            
                            // Caso o usuário ja tenha acertado todas as cartas finaliza o jogo.
                            if(matchCards.length == 16) endGame();
                        } else {
                            openCards.forEach(function(card){
                                card.classList.add('noMatch', 'wobble');
                            });
    
                            // Reseta as cartas voltando-as para baixo após 1.2 segundos.
                            setTimeout(function(){
                                openCards.forEach(function(card){
                                    resetCard(card);
                                });
                                openCards = [];
                            }, 1200);
                        }
                    } 
                }
            }); 
        }, 3000);
    });
}

// Inicializa o jogo após 6 segundos.
setTimeout('startGame()', 6000);

/**
 * Reseta as classes para o valor padrão
 */
function resetCard(card){
    card.classList.remove('match', 'tada', 'noMatch', 'wobble', 'open');
    card.children[0].classList.add('invisible');
}


let resetGame = document.querySelector('.restart');
let newGame = document.querySelector('.start_again');

// Adiciona evento de click bno botão restar para poder resetar o jogo.
resetGame.addEventListener('click', function(){
    document.location.reload(true);
    start_countdown();
});
newGame.addEventListener('click', function(){
    document.location.reload(true);
    document.querySelector('.endGame').style.display = 'none';
    
    setTimeout(function(){
        document.querySelector('.content').style.display = 'flex';
        start_countdown();
    }, 1000);
    
});

// Inicializa a contagem regressiva quando a página carrega.
countdown.addEventListener('onload', start_countdown());

