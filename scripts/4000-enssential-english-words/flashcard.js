//#region Init
const imgPath = `${imgSrc}book/`;
const audioPath = `${audioSrc}book/`;

let card = null;
let flashcards = [];
//#endregion

//#region Card
const rate = (rating) => {
    if (card.rating !== rating) {
        card.repetition = 0;
        card.rating = rating;
    }

    card.repetition++;
    card.status = CARD_STATUS.LEARNING;
    card.dueDate = new Date(Date.now());

    showNextCard();
}

const memorizeCard = () => {
    card.status = CARD_STATUS.MEMORIZED;
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
                            <i class="fa fa-volume-up" onclick="speechCard(event, '${card.en}')"></i> 
                            <span class="accent">US</span>
                            <i class="fa fa-volume-up" onclick="speechCard(event, '${card.en}', 0)"></i>
                            <span class="accent">UK</span>
                        </p>
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="flip-card-back-content">
                        <img class="card-img" src='${imgPath}${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${audioPath}${card.sound}" type="audio/mp3">
                        </audio><br />
                        
                        <span class="card-detail">Vietnamese:</span> ${!card.vi ? "N/A" : card.vi}
                        <i class="fa fa-volume-up" style="margin-left: 2px;" onclick="speech(event, '${card.vi}', 1)"></i><br/>

                        <span class="card-detail">Description:</span> ${card.desc}
                        <i class="fa fa-volume-up" style="margin-left: 2px;" onclick="speech(event, '${card.desc}')"></i>
                        
                        <div style="font-style: italic">
                            <span class="card-detail">Ex: </span>${card.exam}
                            <i class="fa fa-volume-up" style="margin-left: 2px;" onclick="speech(event, '${card.exam}')"></i>
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
        var unitData = await getDataBook();
        var date = new Date(Date.now());
        unitData.forEach(x => {
            x.dueDate = date;
            x.status = CARD_STATUS.NEW;
        });
        localStorage.setItem(key, JSON.stringify(unitData));
    }

    flashcards = JSON.parse(localStorage.getItem(key))
        .filter(x => x.status !== CARD_STATUS.MEMORIZED)
        .sort((a, b) => a.interval - b.interval);

    displayCard();
}

const saveFlashcards = () => {
    const key = `flashcards_${book}_${unit}`;
    localStorage.setItem(key, JSON.stringify(flashcards));
}

getFlashcards();
//#endregion

const speech = async (event, text, isVi = false) => {
    event.stopPropagation();
    var textWithoutTag = text.replace(/<\/?[^>]+>/gi, '');
    const audio = new Audio();
    audio.src = await generateAudio(textWithoutTag, isVi);
    audio.play();
}

const speechCard = (event, text, isEn = true) => {
    event.stopPropagation();
    speechText(text, isEn);
}

//#region Edit vietnamese
const editForm = document.getElementById('editForm');

let enInput = document.getElementById('enInput');
let viInput = document.getElementById('viInput');
let descInput = document.getElementById('descInput');
let examInput = document.getElementById('examInput');

const editWord = () => {
    enInput.value = card.en;
    viInput.value = card.vi;
    document.getElementById('popup').style.display = 'block';
    document.getElementsByClassName("container")[0].style.opacity = ".4";
}

const updateCard = () => {
    card.vi = viInput.value;

    displayCard();
    saveFlashcards();

    hidePopup();
}
//#endregion