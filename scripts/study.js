//#region Init
let card = null;
let cardsData = [];
let flashcards = [];
const path = "assets/data/4000-enssential-english-words/files/Book-";
//#endregion

//#region Card
const rate = (rating) => {
    if (card.rating !== rating) {
        card.repetition = 0;
        card.rating = rating;
    }

    card.repetition++;
    card.status = CARD_STATUS.LEARNING;
    card.learnTime = new Date(Date.now());

    const ratingKey = getKeyByValue(CARD_RATING, rating);
    const time = RATING_TIME[ratingKey] * card.repetition;
    card.dueDate = addMinutes(card.dueDate, time);

    showNextCard();
}
//#endregion

//#region Load data
const showNextCard = () => {
    let date = new Date(Date.now());
    flashcards = cardsData.filter(x => x.dueDate <= date).sort((a, b) => a.dueDate - b.dueDate);
    saveFlashcards();
    displayCard();
}

const displayCard = () => {
    if (flashcards.length > 0) {
        let currentCard = flashcards[0];
        card = cardsData.find(x => x.image == currentCard.image);
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
                        <img class="card-img" src='${path}${card.book}/Image/book/${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${path}${card.book}/Audio/book/${card.sound}" type="audio/mp3">
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
    const key = CONFIG.STUDY_CARD;
    const storedFlashcards = localStorage.getItem(key);
    if (!storedFlashcards) {
        let data = [];
        for (let i = 1; i <= 6; i++) {
            let bookData = await fetchJson(`assets/data/4000-enssential-english-words/books/book-${i}`);
            data.push(bookData);
        }
        localStorage.setItem(key, JSON.stringify(data));
    }

    let date = new Date(Date.now());
    let count = 0;
    const bookData = JSON.parse(localStorage.getItem(key));
    for (let i = 0; i < bookData.length; i++) {
        if (flashcards.length == CONFIG.NUM_OF_LEARN_ON_DAY) {
            break;
        }

        let unitData = bookData[i];
        for (let u = 0; u < unitData.length; u++) {
            if (flashcards.length == CONFIG.NUM_OF_LEARN_ON_DAY) {
                break;
            }

            let cards = unitData[u];
            count += cards.filter(x => x.status === CARD_STATUS.LEARNING && isToday(x.learnTime)).length;
            if (count === CONFIG.NUM_OF_LEARN_ON_DAY) {
                break;
            }

            let learningCards = cards.filter(x => x.status === CARD_STATUS.LEARNING && x.dueDate <= date);
            if (learningCards.length > 0) {
                flashcards.push(learningCards);
                cardsData.push(learningCards);
            }

            if (flashcards.length == CONFIG.NUM_OF_LEARN_ON_DAY) {
                break;
            }

            let newCards = cards.filter(x => x.status === CARD_STATUS.NEW);
            for (let j = 0; j < newCards.length; j++) {
                if (flashcards.length == CONFIG.NUM_OF_LEARN_ON_DAY) {
                    break;
                }

                newCards[j].book = i + 1;
                newCards[j].dueDate = date;
                flashcards.push(newCards[j]);
                cardsData.push(newCards[j]);
            }
        }
    };

    displayCard();
}

const saveFlashcards = () => {
    const key = CONFIG.STUDY_CARD;
    const bookData = JSON.parse(localStorage.getItem(key));
    bookData.forEach(book => {
        book.forEach(unit => {
            unit.forEach(item => {
                let entity = cardsData.find(x => x.image === item.image);
                if (entity) {
                    item.status = entity.status;
                    item.dueDate = entity.dueDate;
                    item.repetition = entity.repetition;
                    item.rating = entity.rating;
                    item.learnTime = entity.learnTime;
                }
            });
        });
    });

    localStorage.setItem(CONFIG.STUDY_CARD, JSON.stringify(bookData));
    console.log(bookData)
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