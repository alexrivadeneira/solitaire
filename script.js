    const suits = ['h', 'd', 's', 'c'];
    const values = [0,1,2,3,4,5,6,7,8,9,10,11,12];

    let piles = [[],[],[],[],[],[],[]];
    let drawPool = [];

    let selectedPile = null;
    let currDraggedOverPile = null;
    let currDraggedOverStack = null;

    let stacks = [[],[],[],[]];

    let remainingDeck = [];
    let remainingDeckDisplay = [];

    const CARD_SIZE = [98, 73];
    const CARD_CENTER = [36.5, 49];

    function getBackgroundCoordsForCard(suit, value){
        const convertSuitToPosValue = {
            c: 0,
            s: 1,
            h: 2,
            d: 3
        };
        const suitValue = convertSuitToPosValue[suit];
        return [-CARD_SIZE[0] * suitValue, -CARD_SIZE[1] * value];
    }

    // function updateStacks(stack, card){
    //     stacks[stack] = card;
    // }




    // still need to account for whether or not card is visible



    


    // display the sorted cards

    function init(){
        var boardDOM = document.querySelector('.board');
        const deck = [];

        suits.forEach(suit => {
        values.forEach(value =>{
            // suit, value, isvisible?
            deck.push([suit, value, false]);
        });
    });

        const shuffledDeck = shuffleDeck(deck);
        dealPiles(piles, shuffledDeck);

    }

    function shuffleDeck(deck){
        let unshuffledDeck = [...deck];
        let shuffledDeck = [];
        while(unshuffledDeck.length > 0){
            let randomSelect = Math.floor(Math.random() * unshuffledDeck.length);
            shuffledDeck.push(unshuffledDeck[randomSelect]);
            unshuffledDeck.splice(randomSelect, 1);
        }
        return shuffledDeck;
    }

    // sort the cards into piles - 7 piles, and which is on the top
    function dealPiles(piles, deck){
        piles.forEach(function(pile, index){
            var doTimes = index;
            for(var i = 0; i <= doTimes; i++){
                piles[index].push(deck.pop());
            }
        });
        // mark each last card on the pile as visible
        piles.forEach(pile => {
            pile[pile.length - 1][2] = true;
        })

        remainingDeck = deck;
    }

    // function setStateSelectedPile(e){
    //     selectedPile = e.id; 
    // }

    function drawPiles(piles){
        var pilesDOM = document.querySelectorAll('.pile');
        // first clear anything in the piles so we don't keep adding duplicate cards
        piles.forEach((pile, index) => {
            pilesDOM[index].innerHTML = '';
        });

        piles.forEach((pile, index) => {
            pile.forEach((card, idx) => {

                if(card[2] === true){

                    var coords = getBackgroundCoordsForCard(card[0], card[1]);
                    // only visible cards are draggable
                    pilesDOM[index].innerHTML += 
                `
                        <div class='card' 
                        style='background: url("card-imgs.png"); 
                        background-position-y:${coords[0]}px; background-position-x:${coords[1]}px;' 
                        data-suit='${card[0]}';
                        data-value='${card[1]}';
                        data-exposed='${card[2]}';
                        onclick='handleCardClick(this)'
                        draggable='${card[2]}'>
                            <strong><span style="color: #bada55; background: #000;">${card[0]} ${card[1]}</span></strong>

                        </div>
                `;
                } else if (card[2] === false ) {
                    pilesDOM[index].innerHTML += 
                `
                        <div class='card ${card[0] === ('c' || 's') ? 'red' : 'black'}' 
                        draggable='false';   
                        data-suit='${card[0]}';
                        data-value='${card[1]}';
                        data-exposed='${card[2]}';
                        onclick='handleCardClick(this)'
                        >
                        </div>
                `;
                }

            });
        });
    }

    function getCardFromDeck(){
        // put displayed card back in the deck

        // console.log('get card')
        if(remainingDeckDisplay.length > 0){
            remainingDeck.push(remainingDeckDisplay.pop())
        } 
        // pop out the next card
        if(remainingDeck.length > 0){
            remainingDeckDisplay.push(remainingDeck.shift());
        }

        console.log(remainingDeck, remainingDeckDisplay)
        drawDeckArea();

    }

    function drawDeckArea(){
        const deckDOMArea = document.querySelector('.deck-display');
        const deckBackDOMArea = document.querySelector('.deck-back');


        if(remainingDeckDisplay.length === 0){
            deckDOMArea.innerHTML = '';
        }

        if(remainingDeck.length === 0){
            deckBackDOMArea.style.visibility = "hidden";
        }

        const card = remainingDeckDisplay[0];
        var coords = getBackgroundCoordsForCard(card[0], card[1]);


        deckDOMArea.innerHTML = '';
        deckDOMArea.innerHTML += 
    `
            <div class='card' 
            style='background: url("card-imgs.png"); 
            background-position-y:${coords[0]}px; background-position-x:${coords[1]}px;' 
            data-suit='${card[0]}';
            data-value='${card[1]}';
            data-exposed='${card[2]}';
            onclick='handleDeckClick(this)'
            draggable='true'
            ondragstart="event.dataTransfer.setData('text/plain', this.id); selectedPile = 'deck';"  
            >
                <strong><span style="color: #bada55; background: #000;">${card[0]} ${card[1]}</span></strong>

            </div>`
    }

    function drawStacks(stacks){
        var stacksDOM = document.querySelectorAll('.stack');
        // first clear anything in the stacks so we don't keep adding duplicate cards
        stacks.forEach((stack, index) => {
            stacksDOM[index].innerHTML = '';
        });

        // get last card in each stack and draw

        stacks.forEach((stack, index) => {
            if(stack.length > 0){
                var lastCard = stack[stack.length - 1];
                var coords = getBackgroundCoordsForCard(lastCard[0], lastCard[1]);
    
                stacksDOM[index].innerHTML = `
                    <div class='card' 
                    style='background: url("card-imgs.png"); 
                    background-position-y:${coords[0]}px; background-position-x:${coords[1]}px;' 
                    data-suit='${lastCard[0]}';
                    data-value='${lastCard[1]}';
                    data-exposed='${lastCard[2]}';
                    onclick='handleCardClick(this)'
                    >
                        <strong><span style="color: #bada55; background: #000;">${lastCard[0]} ${lastCard[1]}</span></strong>
    
                    </div>`
            }

            });
    }
    

    function handleCardClick(card){
        // check if card is last in the pile
        const suit = card.getAttribute('data-suit');
        const value = parseInt(card.getAttribute('data-value'));
        const pileId = card.parentNode.id;

        const currPileData = piles[parseInt(pileId)];  
        const lastCardInPile = currPileData[currPileData.length - 1];

        card[2] = true;
        
        // update last card in pile 
        currPileData[currPileData.length - 1][2] = true;
        drawPiles(piles);

    }

    function handleDeckClick(card){
        console.log('clicking the card');

    }

    function checkIsValidMove(){

    }

    function handleDragOver(e){
        // console.log('drag over event');
        // console.log("drag over: ", e);
        // console.log(e.id)
        currDraggedOverPile = e.id;
    }

    function handleDropCardOnNewPile(pileFromIdx, pileToIdx){
        console.log("TO: ", pileToIdx, "FROM: ", pileFromIdx);
        piles[pileToIdx].push(piles[pileFromIdx].pop());
        drawPiles(piles);
    }

    function handleDrop(){
        // preventDefault();
        console.log("#### DROP");

        if(selectedPile === 'deck'){
            handleDropCardFromDeckOnPile(currDraggedOverPile);
        } else {
            handleDropCardOnNewPile(selectedPile, currDraggedOverPile);
        }

    }

    function handleDropCardFromDeckOnPile(pileToIdx){
        console.log("TO: ", pileToIdx, "FROM: DECK");
        // make the card visible
        const card = remainingDeckDisplay.pop();
        card[2] = true;
        piles[pileToIdx].push(card);
        drawPiles(piles);
        drawDeckArea();
    }   

    // function handleDropCardOnNewPile(pileFromIdx, pileToIdx){
    //     console.log("TO: ", pileToIdx, "FROM: ", pileFromIdx);
    //     piles[pileToIdx].push(piles[pileFromIdx].pop());
    //     drawPiles(piles);
    // }

    function handleStackDrop(){
        console.log('### attempting stack drop');
        // get current card being dropped (from the pile)
        // check current item in that stack
        // check if it's the next card 
        // if so, update the stack 
        // and redraw the stacks


        // TODO: Update this to handle dragging more than the last card on a pile
        var currPile = piles[selectedPile];
        var currCard = currPile[currPile.length - 1];

        console.log('>>> currCard ', currCard);
        // var currStack
        var isNextCard = isNextStackCard(currDraggedOverStack, currCard);

        if(isNextCard){
            console.log('>> is valid stack drop');
            // updateStacks(currDraggedOverStack, currCard);
            moveCardFromPileToStack(selectedPile, currDraggedOverStack);
            drawPiles(piles);
            drawStacks(stacks);
        } else {
            console.log('no dice');
        }
    }

    function moveCardFromPileToStack(pileFrom, stackTo){
        stacks[stackTo].push(piles[pileFrom].pop());
    }

    function isNextStackCard(stack, droppingCard){
        console.log("stack, droppingCard ", stack, droppingCard);

        const stackInt = parseInt(stack);
        const stackData = stacks[stackInt];

        if(stackData.length === 0 && droppingCard[1] === 0){
            return true;
        } else if (stackData.length === 0){
            return false;
        }

        const lastCardOnStack = stackData[stackData.length - 1];
        console.log("lastCardonStack ", lastCardOnStack);

        if(lastCardOnStack[0] === droppingCard[0] && parseInt(droppingCard[1]) === parseInt(lastCardOnStack[1]) + 1){
            return true;
        }
        console.log('invalid stack drop');
        return false;
    }


    
    init();
    drawPiles(piles);


    