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

};

const game = {
    
    gameDiv: document.getElementById("wrapper"),
    colorsArray: ["#679327","#3A1B0F","#A4DA65","#5A3810","#990515","#250D3B","#E0082D","#50105A"],

    getColumnNumber: function() { return parseInt(this.gameDiv.dataset.columnNumber); },
    getRowNumber: function() { return parseInt(this.gameDiv.dataset.rowNumber); },
    getTotalCardsNumber: function() { return this.getColumnNumber() * this.getRowNumber(); },

    flippedCards: 0,
    firstClick: true,
    cards: document.getElementsByClassName('card'),
    firstCardColor: null,
    secondCardColor: null,

};

function createRandomizedSliceOfArray(array, sliceSize) {

    const arraySlice = array.slice(0, sliceSize);
    arraySlice.double();
    arraySlice.shuffle();

    return arraySlice;
}

function flipCard(clickedCard) {

    clickedCard.style.transform = "perspective(200px) rotateY(-180deg)";
    setTimeout(function() {
        clickedCard.style.transform = "perspective(200px) rotateY(0deg)";
        clickedCard.style.backgroundColor = clickedCard.dataset.color;
    }, 200);
    clickedCard.dataset.flipped = true;
}

function handleClick(clickedCard) {
    
    flipCard(clickedCard);

    if (game.firstClick) {
        game.firstCardColor = clickedCard.dataset.color;
        game.firstClick = false;
    } else {
        game.secondCardColor = clickedCard.dataset.color;
        game.firstClick = true;
    }
}

function flipCardsBack() {

    const cards = document.querySelectorAll(config.flippedSelector);
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.backgroundColor = config.coverColor;
        cards[i].dataset.flipped = false;
    };
}

function isCardMatch() {

    return game.firstCardColor === game.secondCardColor;
}

function isGameOver() {

    return game.getTotalCardsNumber() === game.flippedCards;
}

function eventToggler(array, on=true) {

    for (let i = 0; i < array.length; i++) {

        if (on) {
            array[i].addEventListener(config.eventToListen, turnProcess);

        } else {
            array[i].removeEventListener(config.eventToListen, turnProcess);
        }
    }
}

function flipCardsBackAndResetEventListeners() {

    flipCardsBack();
    eventToggler(game.cards, true);
}

function removeCards(array) {
    
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove("card");
        array[i].dataset.flipped = config.removed;
    }
}

function processMatch() {

    game.flippedCards += 2;
    
    const cards = document.querySelectorAll(config.flippedSelector);
    removeCards(cards);
    eventToggler(game.cards, true);
}

function turnProcess() {
    
    if (game.firstClick) {
        handleClick(this);
        this.removeEventListener(config.eventToListen, turnProcess);

    } else {
        handleClick(this);
        eventToggler(game.cards, false);

        if (isCardMatch()) {
            processMatch();
            
            if (isGameOver()) {
                alert(config.victoryString);
            } 

        } else {
            setTimeout(function () {
                flipCardsBack();
                eventToggler(game.cards, true);
            }, 1000);
        }
    }
};

function createCard(color) {

    const card = document.createElement(config.htmlTag);
    card.dataset.color = color;
    card.dataset.flipped = false;
    card.classList.add(config.commonClass, "col", "col-xs-4", "col-sm-2", "col-md-2", "mr-auto");
    card.addEventListener(config.eventToListen, turnProcess);

    return card;
}

function createBoard() {

    const boardDiv = document.createElement(config.htmlTag);
    boardDiv.setAttribute('class', 'container-fluid');
    let rowDiv = document.createElement(config.htmlTag);
    rowDiv.setAttribute('class', 'row justify-content-between');

    const colorsNeeded = game.getTotalCardsNumber() / 2;
    const colorsArray = createRandomizedSliceOfArray(game.colorsArray, colorsNeeded);
    const columnNumber = game.getColumnNumber();
    for (let i = 0; i < colorsArray.length; i++) {

        const card = createCard(colorsArray[i]);
        rowDiv.appendChild(card);

        if (rowDiv.childElementCount === columnNumber) {
            boardDiv.appendChild(rowDiv);
            rowDiv = document.createElement(config.htmlTag);
            rowDiv.setAttribute('class', 'row justify-content-between');
        }    
    }

    return boardDiv;
}

function memoryGame() {
    const board = createBoard();
    game.gameDiv.appendChild(board);
}

memoryGame();
