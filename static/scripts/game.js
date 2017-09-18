Array.prototype.shuffle = function () {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
}

var gameDiv = document.getElementById("wrapper");

var columnNumber = parseInt(gameDiv.dataset.columnNumber);
var rowNumber = parseInt(gameDiv.dataset.rowNumber);

var colors = ["#679327","#3A1B0F","#A4DA65","#5A3810","#990515","#250D3B","#E0082D","#50105A"];

var numberOfColors = columnNumber * rowNumber / 2;
var colorsSlice = colors.slice(0, numberOfColors);
var colorsSliceDouble = colorsSlice.concat(colorsSlice);
colorsSliceDouble.shuffle();

var flippedCards = 0;
var totalCards = columnNumber * rowNumber;
var turnCounter = 1;
var cards = document.getElementsByClassName('card');
var firstCard;
var secondCard;

function createBoard (array, columnNumber) {
    var divArray = document.createElement('div');
    var tempArray = document.createElement('div');
    
    for (var i = 0; i < array.length; i++) {
        var card = document.createElement('div');

        card.setAttribute('class', 'card');
        card.setAttribute('data-color', array[i])
        card.setAttribute('data-flipped', 'false')

        card.addEventListener('click', handleClick);

        tempArray.appendChild(card);

        if ((i + 1) % columnNumber === 0) {
            divArray.appendChild(tempArray);
            tempArray = document.createElement('div');
        }    
    }
    return divArray;
}

var board = createBoard(colorsSliceDouble, columnNumber);
gameDiv.appendChild(board);

function handleClick () {
    console.log("turn counter", turnCounter);
    if (turnCounter === 1) {
        this.style.backgroundColor = this.dataset['color'];
        this.dataset['flipped'] = 'true';
        firstCard = this.dataset['color'];
        this.removeEventListener('click', handleClick);
        turnCounter++;

    } else if (turnCounter === 2) {
        for (var i = 0; i < cards.length; i++) {
            cards[i].removeEventListener('click', handleClick);
        }
        this.style.backgroundColor = this.dataset['color'];
        this.dataset['flipped'] = 'true';
        secondCard = this.dataset['color'];
        if (firstCard === secondCard) {
            flippedCards = flippedCards + 2;
            if (flippedCards === totalCards) {
                alert('You won!');
            }
            var bothCards = document.querySelectorAll('[data-flipped=true]');
            for (i = 0; i < bothCards.length; i++) {
                bothCards[i].setAttribute('class', 'hidden');
            }
            for (var i = 0; i < cards.length; i++) {
                cards[i].addEventListener('click', handleClick);
            }
        } else {
            setTimeout(function(){
                var bothCards = document.querySelectorAll('[data-flipped=true]');
                for (i = 0; i < bothCards.length; i++) {
                    bothCards[i].style.backgroundColor = "black";
                    bothCards[i].setAttribute('data-flipped', 'false');
                }
                for (var i = 0; i < cards.length; i++) {
                    cards[i].addEventListener('click', handleClick);
                }
            }, 1000);
        }
        turnCounter = 1;
    }

}