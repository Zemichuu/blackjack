let deck = [];
let dealerHand = [];
let playerHand = [];
let dealerSum = 0;
let playerSum = 0;
let canHit = true;

const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn");
const resetBtn = document.getElementById("reset-btn");

window.onload = startGame;

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];
    for (let t of types) {
        for (let v of values) {
            deck.push(v + "-" + t);
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    buildDeck();
    shuffleDeck();

    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];

    renderCards();
    updateSums();
}

function getValue(card) {
    let value = card.split("-")[0];
    if (isNaN(value)) {
        if (value === "A") return 11;
        return 10;
    }
    return parseInt(value);
}

function calculateSum(hand) {
    let sum = 0;
    let aceCount = 0;
    for (let card of hand) {
        let val = getValue(card);
        sum += val;
        if (val === 11) aceCount++;
    }
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
    return sum;
}

function renderCards() {
    // Show player cards
    const playerDiv = document.getElementById("player-cards");
    playerDiv.innerHTML = "";
    playerHand.forEach(card => {
        let cardEl = document.createElement("div");
        cardEl.className = "card";
        cardEl.innerText = card.split("-")[0];
        playerDiv.appendChild(cardEl);
    });

    // Show dealer cards (hide first card until stay)
    const dealerDiv = document.getElementById("dealer-cards");
    dealerDiv.innerHTML = "";
    dealerHand.forEach((card, index) => {
        let cardEl = document.createElement("div");
        cardEl.className = "card";
        cardEl.innerText = (index === 0 && canHit) ? "?" : card.split("-")[0];
        dealerDiv.appendChild(cardEl);
    });
}

function updateSums() {
    playerSum = calculateSum(playerHand);
    document.getElementById("player-sum").innerText = playerSum;
    if (playerSum > 21) {
        endGame("You Busted!");
    }
}

hitBtn.addEventListener("click", () => {
    if (!canHit) return;
    playerHand.push(deck.pop());
    renderCards();
    updateSums();
});

stayBtn.addEventListener("click", () => {
    canHit = false;
    dealerSum = calculateSum(dealerHand);

    while (dealerSum < 17) {
        dealerHand.push(deck.pop());
        dealerSum = calculateSum(dealerHand);
    }

    renderCards();
    document.getElementById("dealer-sum").innerText = dealerSum;

    let message = "";
    if (playerSum > 21) message = "You Busted!";
    else if (dealerSum > 21) message = "Arnas Busted! You Win!";
    else if (playerSum === dealerSum) message = "Tie!";
    else if (playerSum > dealerSum) message = "You Win!";
    else message = "Arnas Wins!";

    endGame(message);
});

function endGame(msg) {
    canHit = false;
    document.getElementById("results").innerText = msg;
    hitBtn.disabled = true;
    stayBtn.disabled = true;
    resetBtn.classList.remove("hidden");
}

resetBtn.addEventListener("click", () => {
    location.reload(); // Simple way to reset state

});
