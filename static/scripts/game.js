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
    flipBackOfCard: "perspective(600px) rotateY(-180deg)",
    flipBackOfCardBack: "perspective(600px) rotateY(0deg)",
    flipFrontOfCard: "perspective(600px) rotateY(0deg)",
    flipFrontOfCardBack: "perspective(600px) rotateY(180deg)",
    backOfCard: "back",
    frontOfCard: "front",
    coverColor: "black",
    flippedCardSelector: "[data-flipped=true]",
    htmlTag: "div",
    attributeToSet: "class",
    removed: "removed",
    eventToListen: "click",
    victoryString: "Congratulations!",
    alertString: "Please select from options.",
    commonClass: "card",
    colorsArray: ["#679327","#3A1B0F","#A4DA65","#5A3810","#990515","#250D3B","#E0082D","#50105A"],
};

var game = {
    matchedCards: 0,
    firstClick: true,
    firstCardColor: null,
    secondCardColor: null,
    columnNumber: null,
    rowNumber: null,
};

game.getCards = function() { return document.getElementsByClassName(config.commonClass); };
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
        if (clickedCard.childNodes[i].className === config.backOfCard) {
            clickedCard.childNodes[i].style.transform = config.flipBackOfCard;
        } else if (clickedCard.childNodes[i].className === config.frontOfCard) {
            clickedCard.childNodes[i].style.transform = config.flipFrontOfCard;
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

game.selectFlippedCards = function() { return document.querySelectorAll(config.flippedCardSelector); };
game.flipCardsBack = function (cardsArray) {
    for (let i = 0; i < cardsArray.length; i++) {
        for (let j = 0; j < cardsArray[i].childNodes.length; j++) {
            if (cardsArray[i].childNodes[j].className === config.backOfCard) {
                cardsArray[i].childNodes[j].style.transform = config.flipBackOfCardBack;
            } else if (cardsArray[i].childNodes[j].className === config.frontOfCard) {
                cardsArray[i].childNodes[j].style.transform = config.flipFrontOfCardBack;
            }
        }
        cardsArray[i].dataset.flipped = false;
    }
};

game.isCardMatch = function() { return game.firstCardColor === game.secondCardColor; };
game.isGameOver = function() { return game.getTotalCardsNumber() === game.matchedCards; };

game.addEventListenerToArray = function(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].addEventListener(config.eventToListen, game.turnProcess);
    }
};

game.removeEventListenerFromArray = function(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].removeEventListener(config.eventToListen, game.turnProcess);
    }
};

game.removeCards = function(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].classList.add(config.removed);
        array[i].classList.remove(config.commonClass);
        array[i].dataset.flipped = config.removed;
    }
};

game.processMatch = function() {
    game.removeCards(game.selectFlippedCards());
    game.addEventListenerToArray(game.getCards());
};

game.afterGame = function () {
    alert(config.victoryString);
    game.flipCardsBack(document.getElementsByClassName(config.removed));
};

game.resetUnmatchedCards = function() {
    game.flipCardsBack(game.selectFlippedCards());
    game.addEventListenerToArray(game.getCards());
};

game.afterSecondFlip = function() {
    if (game.isCardMatch()) {
        game.matchedCards += 2;
        setTimeout(function() { game.processMatch(); }, 500);
        if (game.isGameOver()) {
            setTimeout(function() { game.afterGame(); }, 500);
            setTimeout(function() { game.clearBoard(); }, 1000);
        }
    } else {
        setTimeout(function() { game.resetUnmatchedCards(); }, 1000);
    }
};

game.turnProcess = function() {
    if (game.firstClick) {
        game.clickProcess(this);
        this.removeEventListener(config.eventToListen, game.turnProcess);
    } else {
        game.clickProcess(this);
        game.removeEventListenerFromArray(game.getCards());
        game.afterSecondFlip();
    }
};

game.createCardBack = function() {
    let cardBack = document.createElement(config.htmlTag);
    cardBack.classList.add(config.backOfCard);
    cardBack.style.backgroundColor = config.coverColor;
    
    return cardBack;
}

game.createCardFront = function(color) {
    var cardFront = document.createElement(config.htmlTag);
    cardFront.classList.add(config.frontOfCard);
    cardFront.style.backgroundColor = color;
    
    return cardFront;
}

game.createCardWrapper = function(color) {
    var cardWrapper = document.createElement(config.htmlTag);
    cardWrapper.dataset.color = color;
    cardWrapper.dataset.flipped = false;
    cardWrapper.classList.add(config.commonClass);
    cardWrapper.addEventListener(config.eventToListen, game.turnProcess);
    
    return cardWrapper;
}

game.createCard = function(color) {
    var cardBack = game.createCardBack();
    var cardFront = game.createCardFront(color);
    var card = game.createCardWrapper(color);
    card.appendChild(cardFront);
    card.appendChild(cardBack);

    return card;
};

game.createBoardDiv = function() {
    let boardDiv = document.createElement(config.htmlTag);
    boardDiv.setAttribute(config.attributeToSet, 'container');

    return boardDiv;
}

game.createRowDiv = function() {
    var rowDiv = document.createElement(config.htmlTag);
    rowDiv.setAttribute(config.attributeToSet, 'row');

    return rowDiv;
}

game.applyColorsToCards = function(colorsArray) {
    var cardsArray = [];
    for (let i = 0; i < colorsArray.length; i++) {
        var card = game.createCard(colorsArray[i]);
        cardsArray.push(card);
    }
    
    return cardsArray;
}

game.isRowFull = function(rowDiv) { return rowDiv.childElementCount === game.columnNumber; };

game.createBoard = function() {
    var boardDiv = game.createBoardDiv();
    var rowDiv = game.createRowDiv();
    var cardsArray = game.applyColorsToCards(game.getRandomizedArray());

    for (let i = 0; i < cardsArray.length; i++) {
        rowDiv.appendChild(cardsArray[i]);
        if (game.isRowFull(rowDiv)) {
            boardDiv.appendChild(rowDiv);
            rowDiv = game.createRowDiv();
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
    game.matchedCards = 0;
    game.firstClick = true;
    game.firstCardColor = null;
    game.secondCardColor = null;
    game.columnNumber = null;
    game.rowNumber = null;
}

game.clearBoard = function() {
    const board = document.getElementById("gameDiv");
    if (board !== null) {
        if (game.isGameOver()) {
            const cards = document.getElementsByClassName(config.removed);
            for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < cards[i].childNodes.length; j++) {
                    cards[i].childNodes[j].style.opacity = "0";
                }
            }
            setTimeout(function() { board.parentNode.removeChild(board); }, 500);
        } else {
            board.parentNode.removeChild(board);
        }
    }
}

game.processForm = function() {
    game.clearBoard();
    game.resetData();
    const columnNumber = document.getElementById("columnNumber");
    game.columnNumber = parseInt(columnNumber.options[columnNumber.selectedIndex].value);
    const rowNumber = document.getElementById("rowNumber");
    game.rowNumber = parseInt(rowNumber.options[rowNumber.selectedIndex].value);
    if (isNaN(game.rowNumber) || isNaN(game.columnNumber)) {
        alert(config.alertString);
    } else {
        game.initializeGame();
    }
}

game.play = function() {
    const playButton = document.getElementById("play");
    playButton.addEventListener(config.eventToListen, function(event) {
        event.preventDefault();
        game.processForm();
    });
}

game.play();