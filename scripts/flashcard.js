const cardContainer = document.getElementById('card-container');
let currentCard = 0;
let flashcards = [];

// Load flashcards from JSON file
var url = new URL(window.location.href);
var book = url.searchParams.get("book");
var unit = url.searchParams.get("unit");
const imgSrc = `https://www.essentialenglish.review/apps-data/4000-essential-english-words-${book}/data/unit-${unit}/wordlist/`;

fetch(`assets\\data\\4000-enssential-english-words\\books\\book-${book}.json`)
    .then(response => response.json())
    .then(data => {
        var unitData = data[unit - 1];
        var date = new Date();
        for (let i = unitData.length - 1; i > 0; i--) {
            unitData[i].dueDate = date;
            
            const j = Math.floor(Math.random() * (i + 1));
            [unitData[i], unitData[j]] = [unitData[j], unitData[i]];
        }

        flashcards = unitData;
        showCurrentCard();
    });

// Display current flashcard
const showCurrentCard = () => {
    let card = flashcards[currentCard];
    if (card) {
        cardContainer.innerHTML = `
            <div class="flip-card" onclick="this.classList.toggle('active')">
                <div class="flip-card-front">
                    <div class="flip-card-front-content">
                        <p class="word-en">${card.en}</p>
                        <p style="font-size: medium">${card.pron}</p>
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="flip-card-back-content">
                        <img class="card-img" onclick="playAudio('${imgSrc}${card.sound}')" src='${imgSrc}${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${imgSrc}${card.sound}" type="audio/mp3">
                        </audio><br />
                        <span class="card-detail">Vietnamese:</span> ${!card.vi ? "N/A" : card.vi}<br/>
                        <span class="card-detail">Define:</span> ${card.desc}<br/>
                        <div style="font-style: italic">
                            <span class="card-detail">Ex: </span>${card.exam}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        cardContainer.innerHTML = '<div class="flip-card">No more cards</div>';
    }
};

// Function to rate the flashcard
function rate(rating) {
    let card = flashcards[currentCard];
    supermemo(card, rating);
    saveFlashcardsToLocalStorage(book, unit);
    showNextCard();
}

// Display next flashcard
function showNextCard() {
    currentCard = (currentCard + 1) % flashcards.length;
    showCurrentCard();
}

// SuperMemo algorithm implementation
function supermemo(card, rating) {
    if (rating >= 3) {
        if (card.repetition === 0) {
            card.interval = 1;
        } else if (card.repetition === 1) {
            card.interval = 6;
        } else {
            card.interval *= card.easeFactor;
        }
        card.repetition += 1;
    } else {
        card.repetition = 0;
        card.interval = 1;
    }

    card.easeFactor += 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
    if (card.easeFactor < 1.3) {
        card.easeFactor = 1.3;
    }

    card.dueDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
}

// Function to save flashcards data to localStorage
function saveFlashcardsToLocalStorage() {
    const key = `flashcards_${book}_${unit}`;
    localStorage.setItem(key, JSON.stringify(flashcards));
}

// Function to load flashcards data from localStorage
function loadFlashcardsFromLocalStorage() {
    const key = `flashcards_${book}_${unit}`;
    const storedFlashcards = localStorage.getItem(key);
    if (storedFlashcards) {
        flashcards = JSON.parse(storedFlashcards);
        showCurrentCard();
    }
}

// Load flashcards from localStorage on page load
loadFlashcardsFromLocalStorage();
