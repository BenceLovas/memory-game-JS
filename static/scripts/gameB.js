// maybe use array.prototype

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

var gameDiv = document.getElementById("wrapper");

var columnNumber = parseInt(gameDiv.dataset.columnNumber);
var rowNumber = parseInt(gameDiv.dataset.rowNumber);
// constant replece it
var colors = ["#679327","#3A1B0F","#A4DA65","#5A3810","#990515","#250D3B","#E0082D","#50105A"];
var numberOfColors = columnNumber * rowNumber / 2;
var colors = colors.slice(0, numberOfColors);
var colorsDouble = colors.concat(colors);
shuffle(colorsDouble);

var board = createBoard(colorsDouble, columnNumber);
gameDiv.appendChild(board);
// create functions
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

        // OUTSOURCE THIS FUNCTION THEN I CAN MAKE THOSE CARDS UNCLICKABLE
        card.addEventListener('click', function (event) {

            var clickedCard = event.target;
            var colorOfClickedCard = clickedCard.dataset['color'];
            console.log("this: ", this);

            if (turnCounter === 1) {
                clickedCard.style.backgroundColor = colorOfClickedCard;
                clickedCard.dataset['flipped'] = 'true';    
                firstCard = clickedCard.dataset['color'];
                turnCounter++;
            } else if (turnCounter === 2) {
                clickedCard.style.backgroundColor = colorOfClickedCard;
                clickedCard.dataset['flipped'] = 'true';
                secondCard = clickedCard.dataset['color'];
                var bothCards = document.querySelectorAll('[data-flipped=true]');
                console.log("both cards: ", bothCards);
                if (firstCard === secondCard) {
                    for (i = 0; i < bothCards.length; i++) {
                        bothCards[i].setAttribute('data-flipped', 'done');
                    }
                    flippedCards = flippedCards + 2;
                    console.log("flippedCrads: ", flippedCards);
                    console.log("totalCards: ", totalCards);
                    if (flippedCards === totalCards) {
                        alert("You won!");
                    }
                } else {
                    setTimeout(function(){
                        var bothCards = document.querySelectorAll('[data-flipped=true]');
                        for (i = 0; i < bothCards.length; i++) {
                            bothCards[i].style.backgroundColor = "black";
                            bothCards[i].setAttribute('data-flipped', 'false');
                        }
                    }, 2000);
                    bothCards = [];
                    turnCounter = 1;
                }
            }
        });
        tempArray.appendChild(card);
        if ((i + 1) % columnNumber === 0) {
            divArray.appendChild(tempArray);
            tempArray = document.createElement('div');
        }    
    }

    return divArray;
}








// for (i = 0; i < rowNumber; i++) {
//     var gameDiv = document.getElementById("wrapper");
//     var rowDiv = document.createElement('div');
//     rowDiv.setAttribute('class', 'row')
    
//     for (j = 0; j < columnNumber; j++) {
//         var cardDiv = document.createElement("div");
//         cardDiv.setAttribute('class', 'card');
//         rowDiv.appendChild(cardDiv);
//     }
//     gameDiv.appendChild(rowDiv);
// }


