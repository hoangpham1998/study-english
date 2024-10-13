//#region Init
let card = null;
let cardsData = [];
let flashcards = [];
PATH.ESSENTIAL_DATA = PATH.ESSENTIAL_DATA.replace("../../", "");
const path = `${PATH.ESSENTIAL_DATA}files/Book-`;
TEXT_TO_SPEECH.WORD_URL = TEXT_TO_SPEECH.WORD_URL.replace("../../", "");

const userInfo = JSON.parse(localStorage.getItem(STORAGE_KEY.USER_INFO));
if (!userInfo) {
    location.href = "login.html";
}
//#endregion

//#region Card
const rate = async (rating) => {
    if (card.rating !== rating) {
        card.repetition = 0;
        card.rating = rating;
    }

    card.repetition++;

    const ratingKey = getKeyByValue(CARD_RATING, rating);
    let time = RATING_TIME[ratingKey];
    if (rating !== CARD_RATING.AGAIN && rating !== CARD_RATING.HARD) {
        time *= card.repetition;
    }
    card.dueDate = addMinutes(card.dueDate, time);

    await rateWord({
        userId: userInfo.id,
        wordId: card.id,
        dueDate: card.dueDate.toISOString(),
        repetition: card.repetition
    });

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

const displayCard = async () => {
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
                        <img class="card-img" src='${path}${card.bookId}/Image/book/${card.image}' title="${card.en}" /><br/>
                        <audio controls>
                            <source src="${path}${card.bookId}/Audio/book/${card.sound}" type="audio/mp3">
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
    var data = await getStudyCard(userInfo.id);
    if (!data || data.length === 0) {
        return;
    }

    flashcards = [...data];
    cardsData = [...data];

    await displayCard();
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