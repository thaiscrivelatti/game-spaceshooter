const player = document.querySelector(".player"); // nave do jogador
const gameArea = document.querySelector("#game-area") // area de jogo
const enemiesImg = ["img/enemy1.png","img/enemy2.png","img/enemy3.png"];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let enemyInterval;

// Movimento e tiro da nave
function flyShip(event){
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLeft();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRight();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// Funcao para mover à esquerda
function moveLeft(){
    let leftPosition = parseInt(getComputedStyle(player).getPropertyValue("left"));
    console.log(leftPosition);
    if (leftPosition <= 10) {
        return;
    } else {
        let position = leftPosition;
        position -= 50;
        player.style.left = `${position}px`;
    }
}

// Funcao para mover à direita
function moveRight() {
    let leftPosition = parseInt(getComputedStyle(player).getPropertyValue("left"));
    console.log(leftPosition);
    if (leftPosition >= 550) {
        return;
    } else {
        let position = leftPosition;
        position += 50;
        player.style.left = `${position}px`;
    }
}

// Funcionalidade de tiro
function fireLaser() {
    let laser  = createLaserElement();
    gameArea.appendChild(laser);
    moveLaser(laser);
}

// Cria elemento laser
function createLaserElement(){
    let leftPosition = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    let topPosition = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    let newLaser = document.createElement("img");
    newLaser.src = "img/shoot.png";
    newLaser.classList.add("laser");
    newLaser.style.left = `${leftPosition + 25}px`;
    newLaser.style.top = `${topPosition}px`;
    return newLaser;
}

// Move o laser
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let yPosition = parseInt(laser.style.top);

        // Pega lista de inimigos criados
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => { //comparando se cada enemy foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, enemy)) {
                console.log("inimigo",enemy.src);
                enemy.src = 'img/explosion.png';
                enemy.classList.remove('enemy');
                enemy.classList.add('dead-enemy');
            }
        })
        if (yPosition <= 0) {
            laser.remove();
            window.clearInterval(laserInterval);
        } else {
            laser.style.top = `${yPosition - 8}px`; 
        }
    }, 10);
}

// Cria inimigos randomicamente
function createEnemies() {
    let newEnemy = document.createElement("img");
    newEnemy.src = enemiesImg[Math.floor(Math.random()*enemiesImg.length)];
    newEnemy.classList.add("enemy");
    newEnemy.classList.add("enemy-transition");
    newEnemy.style.top = "10px";
    newEnemy.style.left = `${Math.floor(Math.random() * 330) + 10}px`
    gameArea.appendChild(newEnemy); // Adiciona inimigo na area de jogo
    moveEnemy(newEnemy);
}

// Move o inimigo
function moveEnemy(enemy){
    let moveEnemyInterval = setInterval(() => {
        let yPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));
        //console.log(yPosition);
        if (yPosition >= 520) {
            if (Array.from(enemy.classList).includes('dead-enemy')) {
                enemy.remove();
                window.clearInterval(moveEnemyInterval);
            } else {
                gameOver();
            }
        } else {
            enemy.style.top = `${yPosition + 4}px`; 
        }
    }, 30);
}

// Função de colisão
function checkLaserCollision(laser, enemy) {
    /**
     * Lógica da colisão:
     * O topo do laser deve ser maior ou igual o bottom do inimigo.
     * Como não existe a propriedade bottom no css do inimigo, pode-se calcular o bottom dele como: top-height
     * 
     */
    let enemyWidth = parseInt(window.getComputedStyle(enemy).getPropertyValue("width"));
    let enemyHeight = parseInt(window.getComputedStyle(enemy).getPropertyValue("height"));

    let laserTop = parseInt(laser.style.top);
    let enemyBottom = parseInt(enemy.style.top) + enemyHeight;

    let laserLeft = parseInt(laser.style.left);
    let enemyLeft = parseInt(enemy.style.left) + 5; // Colocando 5px de margem para considerar o tiro
    let enemyRight = (enemyLeft + enemyWidth) + 5;

    if ((laserTop <= enemyBottom) && ((laserLeft >= enemyLeft) && (laserLeft <= enemyRight))) {
        console.log("COLIDIUUUUUUU");
        return true;
    } else {
        return false;
    }
}

// Inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    enemyInterval = setInterval(() => {
        createEnemies();
    }, 2000);
}

// Função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(enemyInterval);
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => enemy.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}