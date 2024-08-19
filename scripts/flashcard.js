const timeInterval = 86400000;

const imgPath = `${imgSrc}book/`;
const audioPath = `${audioSrc}book/`;

let currentCard = 0;
let flashcards = [];

const fetchData = async () => {
    const data = await fetchJson(`${jsonPath}books/book-${book}`);
    var unitData = data[unit - 1];
    var date = new Date(Date.now());
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
    flashcards = flashcards.sort((a, b) => a.dueDate - b.dueDate);
    showCurrentCard();
}

// SuperMemo algorithm implementation
function supermemo(card, rating) {
    card.easeFactor += 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
    card.easeFactor = Math.max(1.3, Math.min(card.easeFactor, 2.5));
    
    if (rating === 1) {
        card.repetition = 0;
        card.interval = 1;
    } else {
        switch (card.repetition) {
            case 0:
                card.interval = 1;
                break;
            case 1:
                card.interval = 3;
                break;
            default:
                let intervalMultiplier = 1;
                if (rating === 2) {
                    intervalMultiplier = 0.8;
                } else if (rating === 4) {
                    intervalMultiplier = 1.2;
                }
                card.interval *= card.easeFactor * intervalMultiplier;
                break;
        }
        card.repetition += 1;
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

// Get modal element
const editForm = document.getElementById('editForm');
const modal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close');

let enInput = document.getElementById('enInput');
let viInput = document.getElementById('viInput');
let descInput = document.getElementById('descInput');
let examInput = document.getElementById('examInput');

const editWord = () => {
    let card = flashcards[currentCard];
    
    enInput.value = card.en;
    viInput.value = card.vi;
    descInput.value = card.desc;
    examInput.value = card.exam;

    modal.style.display = 'flex';
}

const cancel = () => {
    event.preventDefault();
    modal.style.display = 'none';
}

const updateCard = () => {
    event.preventDefault();

    let card = flashcards[currentCard];
    card.vi = viInput.value;
    card.desc = descInput.value;
    card.exam = examInput.value;

    showCurrentCard();
    saveFlashcardsToLocalStorage();

    modal.style.display = 'none';
}