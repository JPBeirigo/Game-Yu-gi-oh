const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        fieldCards: {
            player: document.getElementById("player-field-card"),
            computer: document.getElementById("computer-field-card")
        },
    },
    actions: {
        button: document.getElementById("next-duel")
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    }
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/"

const cardData = [{
    Id:0,
    name:"Blue Eyes White Dragom",
    type:"Rock",
    img:`${pathImages}dragon.png`,
    WinOf: [1],
    loseOf: [2],
},
{
    Id:1,
    name:"Dark Magician",
    type:"Rock",
    img:`${pathImages}magician.png`,
    WinOf: [2],
    loseOf: [0],
},
{
    Id:2,
    name:"Exodia",
    type:"Scissors",
    img:`${pathImages}exodia.png`,
    WinOf: [0],
    loseOf: [1],
}]



async function  getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].Id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }

    return cardImage;
}

async function setCardsField(cardId) {


    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImags(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);
    

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId,computerCardId) {
    state.cardSprites.fieldCards.player.src = cardData[cardId].img;
    state.cardSprites.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImags(value) {
    if(value == true){
        state.cardSprites.fieldCards.player.style.display = "block";    
        state.cardSprites.fieldCards.computer.style.display = "block";
    }

    if(value == false){
        state.cardSprites.fieldCards.player.style.display = "none";    
        state.cardSprites.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(ComputerCardId)){
        duelResults = "Win";
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(ComputerCardId)){
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults
}

async function  removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    
}

async function  drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i=0;i<cardNumbers;i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
    
}

async function  resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.cardSprites.fieldCards.player.style.display = "none";
    state.cardSprites.fieldCards.computer.style.display = "none";

    init();
}

async function  playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

try{
        audio.play();
    } catch {}
}

function init() {

    showHiddenCardFieldsImags(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.play();
}

init();

