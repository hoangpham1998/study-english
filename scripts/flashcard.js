//#region Init
const imgPath = `${imgSrc}book/`;
const audioPath = `${audioSrc}book/`;

let card = null;
let flashcards = [];

const CardStatus = {
    NEW: 0,
    LEARNING: 1,
    MEMORIZED: 2,
};

const CardRating = {
    AGAIN: 0,
    HARD: 1,
    GOOD: 2,
    EASY: 3
};
//#endregion

//#region Card
const rate = (rating) => {
    if (card.rating !== rating) {
        card.repetition = 0;
        card.rating = rating;
    }

    card.repetition++;
    card.status = CardStatus.LEARNING;
    card.dueDate = new Date(Date.now());

    showNextCard();
}

const memorizeCard = () => {
    card.status = CardStatus.MEMORIZED;
    var cardIndex = flashcards.indexOf(card);
    if (cardIndex > -1) {
        flashcards.splice(cardIndex, 1);
    }

    showNextCard();
}
//#endregion

//#region Algorithm
const sortFlashcards = () => {
    flashcards = flashcards.sort((a, b) => {
        if (a.status !== b.status) {
            return a.status - b.status;
        }

        if (a.rating !== b.rating) {
            return a.rating - b.rating;
        }

        if (a.repetition !== b.repetition) {
            return a.repetition - b.repetition;
        }

        return a.dueDate - b.dueDate;
    });
}
//#endregion

//#region Load data
const showNextCard = () => {
    sortFlashcards();
    saveFlashcards();
    displayCard();
}

const displayCard = () => {
    if (flashcards.length > 0) {
        card = flashcards[0];
        container.innerHTML = `
            <div class="flip-card" onclick="this.classList.toggle('active')">
                <div class="flip-card-front">
                    <div class="flip-card-front-content">
                        <p class="word-en">${card.en}</p>
                        <p style="font-size: medium; margin-bottom: 0">${card.pron}</p>
                        <p style="font-size: large; margin-bottom: 0">
                            <i class="fa fa-volume-up" onclick="speechCard(event, 'audio-${card.sound}-us')"></i> 
                            <span class="accent">US</span>
                            <i class="fa fa-volume-up" onclick="speechCard(event, 'audio-${card.sound}-gb', 'GB')"></i>
                            <span class="accent">UK</span>
                        </p>
                        <audio id="audio-${card.sound}-us" src="${ttsUrl}-US/${card.en}.mp3" type="audio/mp3" style="display: none;"></audio>
                        <audio id="audio-${card.sound}-gb" src="${ttsUrl}-GB/${card.en}.mp3" type="audio/mp3" style="display: none;"></audio>
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="flip-card-back-content">
                        <img class="card-img" src='${imgPath}${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${audioPath}${card.sound}" type="audio/mp3">
                        </audio><br />
                        <i class="fa fa-volume-up" style="margin-right: 2px;" onclick="speech(event, '${card.vi}', 1)"></i>
                        <span class="card-detail">Vietnamese:</span> ${!card.vi ? "N/A" : card.vi}<br/>

                        <i class="fa fa-volume-up" style="margin-right: 2px;" onclick="speech(event, '${card.desc}')"></i>
                        <span class="card-detail">Description:</span> ${card.desc}
                        
                        <div style="font-style: italic">
                            <i class="fa fa-volume-up" style="margin-right: 2px;" onclick="speech(event, '${card.exam}')"></i>
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

        document.querySelectorAll(".update-card").forEach(x => {
            x.disabled = true;
        });
    }
};

const getFlashcards = async () => {
    const key = `flashcards_${book}_${unit}`;
    const storedFlashcards = localStorage.getItem(key);
    if (!storedFlashcards) {
        const data = await fetchJson(`${jsonPath}books/book-${book}`);
        var unitData = data[unit - 1];
        var date = new Date(Date.now());
        unitData.forEach(x => { 
            x.dueDate = date;
            x.status = CardStatus.NEW;
        });
        localStorage.setItem(key, JSON.stringify(unitData));
    }

    flashcards = JSON.parse(localStorage.getItem(key))
        .filter(x => x.status !== CardStatus.MEMORIZED)
        .sort((a, b) => a.interval - b.interval);
    
    displayCard();
}

const saveFlashcards = () => {
    const key = `flashcards_${book}_${unit}`;
    localStorage.setItem(key, JSON.stringify(flashcards));
}

getFlashcards();
//#endregion

//#region Navigate
const openQuiz = () => {
    location.href = `quiz.html?book=${book}&unit=${unit}`;
}

const openStory = () => {
    location.href = `story.html?book=${book}&unit=${unit}`;
}
//#endregion

//#region Edit vietnamese
const editForm = document.getElementById('editForm');
const modal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close');

let enInput = document.getElementById('enInput');
let viInput = document.getElementById('viInput');
let descInput = document.getElementById('descInput');
let examInput = document.getElementById('examInput');

const editWord = (event) => {
    enInput.value = card.en;
    viInput.value = card.vi;

    modal.style.display = 'flex';
}

const cancel = () => {
    event.preventDefault();
    modal.style.display = 'none';
}

const updateCard = () => {
    event.preventDefault();

    card.vi = viInput.value;

    displayCard();
    saveFlashcards();

    modal.style.display = 'none';
}
//#endregion

//#region TTS
const speechCard = (event, id) => {
    event.stopPropagation();
    let audio = document.getElementById(id);
    audio.play();
}

const speech = async (event, text, isVi = false) => {
    event.stopPropagation();

    const audio = new Audio();
    audio.src = await generateAudio(text.replace(/<\/?[^>]+>/gi, ''), isVi);
    audio.play();
}
//#endregion