Array.prototype.shuffle = function() {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
}

Array.prototype.double = function() {
    var length = this.length;
    for (let i = 0; i < length; i++) {
        this.push(this[i]);
    }
}

const config = {
    coverColor: "black",
    flippedSelector: "[data-flipped=true]",
    htmlTag: "div",
    attributeToSet: "class",
    removed: "removed",
    eventToListen: "click",
    victoryString: "Congratulations!",
    commonClass: "card",
    colorsArray: ["#679327","#3A1B0F","#A4DA65","#5A3810","#990515","#250D3B","#E0082D","#50105A"],
};

const game = {
    flippedCards: 0,
    firstClick: true,
    cards: document.getElementsByClassName(config.commonClass),
    firstCardColor: null,
    secondCardColor: null,
};

game.gameDiv = document.getElementById("wrapper");

game.columnNumber = parseInt(game.gameDiv.dataset.columnNumber);
game.rowNumber = parseInt(game.gameDiv.dataset.rowNumber);
game.totalCardsNumber = game.columnNumber * game.rowNumber;
game.colorsNeeded = game.totalCardsNumber / 2;

game.arraySlice = config.colorsArray.slice(0, game.colorsNeeded);
game.getRandomizedArray = function() {
    const array = game.arraySlice;
    array.double();
    array.shuffle();
    
    return array;
};

game.flipCard = function(clickedCard) {
    clickedCard.style.transform = "perspective(200px) rotateY(-180deg)";
    setTimeout(function() {
        clickedCard.style.transform = "perspective(200px) rotateY(0deg)";
        clickedCard.style.backgroundColor = clickedCard.dataset.color;
    }, 200);
    clickedCard.dataset.flipped = true;
};

game.clickProcess = function(clickedCard) {
    game.flipCard(clickedCard);
    
    if (game.firstClick) {
        game.firstCardColor = clickedCard.dataset.color;
        game.firstClick = false;
    } else {
        game.secondCardColor = clickedCard.dataset.color;
        game.firstClick = true;
    }
};

game.selectFlippedCards = function() { return document.querySelectorAll(config.flippedSelector); };
game.flipCardsBack = function () {
    const cards = game.selectFlippedCards();
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.backgroundColor = config.coverColor;
        cards[i].dataset.flipped = false;
    }
};

game.isCardMatch = function() { return game.firstCardColor === game.secondCardColor; };
game.isGameOver = function() { return game.totalCardsNumber === game.flippedCards; };

game.addEventListenerToArray = function(array, callbackFunction) {
    for (let i = 0; i < array.length; i++) {
        array[i].addEventListener(config.eventToListen, callbackFunction);
    }
};

game.removeEventListenerFromArray = function(array, callbackFunction) {
    for (let i = 0; i < array.length; i++) {
        array[i].removeEventListener(config.eventToListen, callbackFunction);
    }
};

game.removeCards = function(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove(config.commonClass);
        array[i].dataset.flipped = config.removed;
    }
};

game.processMatch = function(callbackFunction) {
    game.flippedCards += 2;
    const cards = game.selectFlippedCards();
    game.removeCards(cards);
    game.addEventListenerToArray(game.cards, callbackFunction);
}

game.turnProcess = function() {
    if (game.firstClick) {
        game.clickProcess(this);
        this.removeEventListener(config.eventToListen, game.turnProcess);
    } else {
        game.clickProcess(this);
        game.removeEventListenerFromArray(game.cards, game.turnProcess);
        if (game.isCardMatch()) {
            game.processMatch(game.turnProcess);
            if (game.isGameOver()) {
                alert(config.victoryString);
            }
        } else {
            setTimeout(function() {
                game.flipCardsBack();
                game.addEventListenerToArray(game.cards, game.turnProcess);
            }, 1000);
        }
    }
};

game.createCard = function(color) {
    const card = document.createElement(config.htmlTag);
    card.dataset.color = color;
    card.dataset.flipped = false;
    card.classList.add(config.commonClass, "col", "col-xs-4", "col-sm-2", "col-md-2", "mr-auto");
    card.addEventListener(config.eventToListen, game.turnProcess);

    return card;
};

game.createBoard = function() {
    const boardDiv = document.createElement(config.htmlTag);
    boardDiv.setAttribute(config.attributeToSet, 'container-fluid');
    let rowDiv = document.createElement(config.htmlTag);
    rowDiv.setAttribute(config.attributeToSet, 'row justify-content-between');

    const colorsArray = game.getRandomizedArray();
    for (let i = 0; i < colorsArray.length; i++) {

        const card = game.createCard(colorsArray[i]);
        rowDiv.appendChild(card);

        if (rowDiv.childElementCount === game.columnNumber) {
            boardDiv.appendChild(rowDiv);
            rowDiv = document.createElement(config.htmlTag);
            rowDiv.setAttribute(config.attributeToSet, 'row justify-content-between');
        }    
    }
    return boardDiv;
};

game.initializeGame = function() {
    const board = game.createBoard();
    game.gameDiv.appendChild(board);
}

game.initializeGame();
