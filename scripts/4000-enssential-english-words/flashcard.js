//#region Init
const imgPath = `${imgSrc}book/`;
const audioPath = `${audioSrc}book/`;

let cardIndex = 0;
let flashcards = [];
//#endregion

//#region Load data
const displayCard = () => {
    card = flashcards[cardIndex];
    if (card) {
        container.innerHTML = `
            <div id="card-${cardIndex}" class="flip-card" onclick="this.classList.toggle('active')">
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
                    <button class="edit-button" onclick="editWord(event)">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
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
    }
};

const getFlashcards = async () => {
    flashcards = await getWords(book, unit);
    displayCard();
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

const editWord = (event) => {
    event.stopPropagation();
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

const carouselInner = document.querySelector('.tab-content');
let startX = null;

// Start dragging
const handleDragStart = (e) => {
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
};

// End dragging
const handleDragEnd = (e) => {
    if (startX === null) return;

    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diffX = startX - endX;

    // Determine swipe direction
    let cardElement = document.getElementById(`card-${cardIndex}`);
    if (diffX > 50 && cardIndex !== flashcards.length) {
        cardElement.classList.remove('active');
        cardElement.classList.add('fade-out');
        setTimeout(() => {
            cardIndex++;
            cardElement.classList.remove('fade-out');
            cardElement.classList.add('fade-in');
            displayCard();
        }, 300);
    } else if (diffX < -50 && cardIndex !== 0) {
        cardElement.classList.remove('active');
        cardElement.classList.add('fade-in');
        setTimeout(() => {
            cardIndex--;
            cardElement.classList.remove('fade-in');
            cardElement.classList.add('fade-out');
            displayCard();
        }, 300);
    }

    startX = null;
};

// Add event listeners for touch devices
carouselInner.addEventListener('touchstart', handleDragStart);
carouselInner.addEventListener('touchend', handleDragEnd);

// Add event listeners for mouse devices
carouselInner.addEventListener('mousedown', handleDragStart);
carouselInner.addEventListener('mouseup', handleDragEnd);
carouselInner.addEventListener('mouseleave', handleDragEnd);