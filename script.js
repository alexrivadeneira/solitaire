    const suits = ['h', 'd', 's', 'c'];
    const values = [0,1,2,3,4,5,6,7,8,9,10,11,12];

    let piles = [[],[],[],[],[],[],[]];
    let drawPool = [];

    let selectedPile = null;
    let currDraggedOverPile = null;
    let currDraggedOverStack = null;

    let stacks = [[],[],[],[]]

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

    function updateStacks(stack, card){
        stacks[stack] = card;
    }




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
    }

    function setStateSelectedPile(e){
        selectedPile = e.id; 
        // console.log("@@@ selected pile", selectedPile);
    }

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
                        draggable='${card[2]}'>
                            <strong><span style="color: #bada55; background: #000;">${card[0]} ${card[1]}</span></strong>

                        </div>
                `;
                } else if (card[2] === false ) {
                    pilesDOM[index].innerHTML += 
                `
                        <div class='card ${card[0] === ('c' || 's') ? 'red' : 'black'}' draggable='false'>
                        </div>
                `;
                }

            });
        });
    }

    function handleDragOver(e){
        // console.log('drag over event');
        // console.log("drag over: ", e);
        // console.log(e.id)
        currDraggedOverPile = e.id;
    }

    function handleDropCardOnNewPile(pileFromIdx, pileToIdx){
        console.log("TO: ", pileToIdx, "FROM: ", pileFromIdx);piles[pileToIdx].push(piles[pileFromIdx].pop());
        drawPiles(piles);
    }

    function handleDrop(){
        // preventDefault();
        console.log("#### DROP");
        handleDropCardOnNewPile(selectedPile, currDraggedOverPile);
    }

    function handleStackDrop(){
        // get current card being dropped (from the pile)
        // check current item in that stack
        // check if it's the next card 
        // if so, update the stack 
        // and redraw the stacks

        console.log('dropping on stack');

        // TODO: Update this to handle dragging more than the last card on a pile
        var currPile = piles[selectedPile];
        var currCard = currPile[currPile.length - 1];
        var isNextCard = isNextStackCard(stacks[currDraggedOverStack], currCard);

        console.log(">>>> ", stacks[currDraggedOverStack], currCard);

        if(isNextCard){
            updateStacks(currDraggedOverStack, currCard);
            moveCardFromPileToStack(selectedPile, currDraggedOverStack);
            drawPiles();
            drawStacks();
            console.log('is next card');
        } else {
            console.log('no dince');
        }
    }

    function moveCardFromPileToStack(pileFrom, stackTo){
        stacks[stackTo] = piles[pileFrom].pop();
    }

    function isNextStackCard(currCardOnStack, droppingCard){
        if(currCardOnStack.length === 0 && droppingCard[1] === 0){
            return true;
        }

        if(currCardOnStack[1] === droppingCard[1] && currCardOnStack[0] === droppingCard[0] + 1){
            return true;
        }
        return false;
    }


    

    // check if valid drop

    // allow drops onto the top stacks

    // keep track of whether cards are displayed or not
        // card at top of stack, but not flipped over

    // when you interact with a pile:
        // drag a card from one pile to another eligible pile
            // drag a card to an empty pile
        // flip the card that's been exposed

    // drag logic - to simply move card without taking into account values

    // pick up the visible card off a pile
    // drag and hover over new pile
    // get the new pile id
    // update the pile state with the new card
    // redraw the piles

    // displaying the pile
        // after the initial deal, the top card should be exposed

    
    init();
    drawPiles(piles);

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', event => {
            console.log('card click', event);
        });
    });

    // console.log(piles);
    