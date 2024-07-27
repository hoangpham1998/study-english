const timeInterval = 86400000;
const easeFactor = 1.3;

const imgPath = `${imgSrc}book/`;
const audioPath = `${audioSrc}book/`;

let currentCard = 0;
let flashcards = [];

const fetchData = async () => {
    const data = await fetchJson(`${jsonPath}books/book-${book}`);
    var unitData = data[unit - 1];
    var date = new Date();
    for (let i = unitData.length - 1; i > 0; i--) {
        unitData[i].dueDate = date;
        
        const j = Math.floor(Math.random() * (i + 1));
        [unitData[i], unitData[j]] = [unitData[j], unitData[i]];
    }

    flashcards = unitData;
    showCurrentCard();
}

// Display current flashcard
const showCurrentCard = () => {
    let card = flashcards[currentCard];
    if (card) {
        container.innerHTML = `
            <div class="flip-card" onclick="this.classList.toggle('active')">
                <div class="flip-card-front">
                    <div class="flip-card-front-content">
                        <p class="word-en">${card.en}</p>
                        <p style="font-size: medium">${card.pron}</p>
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="flip-card-back-content">
                        <img class="card-img" onclick="playAudio('${audioPath}${card.sound}')" src='${imgPath}${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${audioPath}${card.sound}" type="audio/mp3">
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
        container.innerHTML = `
            <div class="flip-card" style="text-aligh: center">
                <div class="flip-card-front">
                    <div class="flip-card-front-content">
                        <p class="word-en">No more cards</p>
                    </div>
                </div>
            </div>
        `;
    }
};

// Function to rate the flashcard
function rate(rating) {
    let card = flashcards[currentCard];
    supermemo(card, rating);
    saveFlashcardsToLocalStorage();
    showNextCard();
}

function memorizeCard() {
    let card = flashcards[currentCard];
    card.memorized = true;

    if (currentCard > -1) {
        flashcards.splice(currentCard, 1);
    }

    saveFlashcardsToLocalStorage();
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
        switch (card.repetition) {
            case 0:
                card.interval = 1;
                break;
            case 1:
                card.interval = 6;
                break;
            default:
                card.interval *= card.easeFactor;
                break;
        }
        card.repetition += 1;
    } else {
        card.repetition = 0;
        card.interval = 1;
    }

    card.easeFactor += 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
    if (card.easeFactor < easeFactor) {
        card.easeFactor = easeFactor;
    }

    card.dueDate = new Date(Date.now() + card.interval * timeInterval);
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
        flashcards = JSON.parse(storedFlashcards).filter(x => !x.memorized);
        showCurrentCard();
    }
    else {
        fetchData();
    }
}

// Load flashcards from localStorage on page load
loadFlashcardsFromLocalStorage();

const openQuiz = () => {
    location.href = `quiz.html?book=${book}&unit=${unit}`;
}

const openStory = () => {
    location.href = `story.html?book=${book}&unit=${unit}`;
}
