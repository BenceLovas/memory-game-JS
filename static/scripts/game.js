Array.prototype.shuffle = function() {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
}

Array.prototype.double = function() {
    const length = this.length;
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

var game = {
    flippedCards: 0,
    firstClick: true,
    cards: document.getElementsByClassName(config.commonClass),
    firstCardColor: null,
    secondCardColor: null,
    columnNumber: null,
    rowNumber: null,
};

game.getTotalCardsNumber = function() { return game.columnNumber * game.rowNumber; };
game.getColorsNeeded = function() { return game.getTotalCardsNumber() / 2; };

game.getArraySlice = function() { return config.colorsArray.slice(0, game.getColorsNeeded()); };
game.getRandomizedArray = function() {
    let array = game.getArraySlice();
    array.double();
    array.shuffle();
    
    return array;
};

game.flipCard = function(clickedCard) {
    for (let i = 0; i < clickedCard.childNodes.length; i++) {
        if (clickedCard.childNodes[i].className === "back") {
            clickedCard.childNodes[i].style.transform = "perspective(600px) rotateY(-180deg)";
        } else if (clickedCard.childNodes[i].className === "front") {
            clickedCard.childNodes[i].style.transform = "perspective(600px) rotateY(0deg)";
        }
    }
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
        for (let j = 0; j < cards[i].childNodes.length; j++) {
            if (cards[i].childNodes[j].className === "back") {
                cards[i].childNodes[j].style.transform = "perspective(600px) rotateY(0deg)";
            } else if (cards[i].childNodes[j].className === "front") {
                cards[i].childNodes[j].style.transform = "perspective(600px) rotateY(180deg)";
            }
        }
        cards[i].dataset.flipped = false;
    }
};

game.isCardMatch = function() { return game.firstCardColor === game.secondCardColor; };
game.isGameOver = function() { return game.getTotalCardsNumber() === game.flippedCards; };

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
        array[i].classList.add(config.removed);
        array[i].classList.remove(config.commonClass);
        array[i].dataset.flipped = config.removed;
    }
};

game.processMatch = function(callbackFunction) {
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
            game.flippedCards += 2;
            setTimeout(function() {
                game.processMatch(game.turnProcess);
            }, 500);
            if (game.isGameOver()) {
                setTimeout(function() {
                    alert(config.victoryString);
                    game.flipCardsBackAfterWin();
                }, 500);
                setTimeout(function() {
                    game.clearBoardAfterWin();
                }, 1000);
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
    let card = document.createElement(config.htmlTag);
    let cardBack = document.createElement(config.htmlTag);
    let cardFront = document.createElement(config.htmlTag);
    cardBack.classList.add("back");
    cardFront.classList.add("front");
    cardBack.style.backgroundColor = config.coverColor;
    cardFront.style.backgroundColor = color;
    card.dataset.color = color;
    card.dataset.flipped = false;
    // card.classList.add(config.commonClass, "col", "col-xs-4", "col-sm-2", "col-md-2", "mr-auto");
    card.classList.add(config.commonClass);
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.addEventListener(config.eventToListen, game.turnProcess);

    return card;
};

game.createBoard = function() {
    let boardDiv = document.createElement(config.htmlTag);
    boardDiv.setAttribute(config.attributeToSet, 'container');
    let rowDiv = document.createElement(config.htmlTag);
    rowDiv.setAttribute(config.attributeToSet, 'row');

    const colorsArray = game.getRandomizedArray();
    for (let i = 0; i < colorsArray.length; i++) {

        const card = game.createCard(colorsArray[i]);
        rowDiv.appendChild(card);

        if (rowDiv.childElementCount === game.columnNumber) {
            boardDiv.appendChild(rowDiv);
            rowDiv = document.createElement(config.htmlTag);
            rowDiv.setAttribute(config.attributeToSet, 'row');
        }    
    }
    return boardDiv;
};

game.initializeGame = function() {
    const board = game.createBoard();
    let gameDiv = document.createElement(config.htmlTag);
    gameDiv.setAttribute('id', 'gameDiv');
    gameDiv.appendChild(board);
    document.body.appendChild(gameDiv);
}

game.resetData = function() {
    game.flippedCards = 0;
    game.firstClick = true;
    game.cards = document.getElementsByClassName(config.commonClass);
    game.firstCardColor = null;
    game.secondCardColor = null;
    game.columnNumber = null;
    game.rowNumber = null;
}

game.flipCardsBackAfterWin = function() {
    const cards = document.getElementsByClassName(config.removed);
    for (let i = 0; i < cards.length; i++) {
        for (let j = 0; j < cards[i].childNodes.length; j++) {
            if (cards[i].childNodes[j].className === "back") {
                cards[i].childNodes[j].style.transform = "perspective(600px) rotateY(0deg)";
            } else if (cards[i].childNodes[j].className === "front") {
                cards[i].childNodes[j].style.transform = "perspective(600px) rotateY(180deg)";
            }
        }
    }
}

game.clearBoardAfterWin = function() {
    const board = document.getElementById("gameDiv");
    if (board !== null) {
        const cards = document.getElementsByClassName(config.removed);
        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < cards[i].childNodes.length; j++) {
                cards[i].childNodes[j].style.opacity = "0";
            }
        }
        setTimeout(function() {
            board.parentNode.removeChild(board);
        }, 500);
    }
}


game.clearBoard = function() {
    const board = document.getElementById("gameDiv");
    if (board !== null) {
        board.parentNode.removeChild(board);
    }
}

game.processForm = function() {
    game.resetData();
    game.clearBoard();
    const columnNumber = document.getElementById("columnNumber");
    game.columnNumber = parseInt(columnNumber.options[columnNumber.selectedIndex].value);
    const rowNumber = document.getElementById("rowNumber");
    game.rowNumber = parseInt(rowNumber.options[rowNumber.selectedIndex].value);
    if (isNaN(game.rowNumber) || isNaN(game.columnNumber)) {
        alert("Please select from options.");
    } else {
        game.initializeGame();
    }
}

game.play = function() {
    const playButton = document.getElementById("play");
    playButton.addEventListener("click", function(event) {
        event.preventDefault();
        game.processForm();
    });
}

game.play();