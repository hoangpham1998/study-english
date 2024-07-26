let currentCard = 0;
let questions = [];
let wordIndexs = [];
let chosenWord = "";

let question = document.getElementById("question");
let questionIndex = document.getElementById("question-index");
const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters-container");

const fetchData = async () => {
    const data = await fetchJson(`${jsonPath}books/book-${book}`);
    questions = shuffleData(data[unit - 1]);

    showCurrentCard();

    document.getElementById("previous").disabled = true;
    document.getElementById("next").disabled = true;
    document.getElementById("remove-btn").disabled = true
}

const showCurrentCard = () => {
    let card = questions[currentCard];
    if (!card)
        return;

    wordContainer.classList.remove("correct");
    wordContainer.classList.remove("incorrect");

    question.innerHTML = card.vi;
    questionIndex.innerHTML = `${currentCard + 1}/${questions.length}`;

    chosenWord = card.en.split("");
    
    if (!card.disabled) {
        wordIndexs = [];
    
        card.wordToGuess = chosenWord.map(letter => '_');
        wordContainer.innerHTML = card.wordToGuess.join(" ");
    } else {
        wordContainer.innerHTML = card.wordToGuess;
        wordContainer.classList.add("correct");
    }

    if (!card.isGen) {
        card.words = shuffleData(chosenWord);
        card.isGen = true;
    }
    
    lettersContainer.innerHTML = "";
    card.words.forEach((letter, index) => {
        lettersContainer.innerHTML += `<button class="letter" id="${currentCard}-${index}"
            ${card.disabled ? "disabled" : ""} onclick="check(${index}, '${letter}')">
                ${letter}
            </button>`;
    });
    lettersContainer.innerHTML += `<button class="letter" id="remove-btn" ${card.disabled ? "disabled" : ""}
        onclick="remove()"><i class="remove-icons">backspace</i></button>`;
};

const check = (index, letter) => {
    var card = questions[currentCard];
    var wordToGuess = card.wordToGuess;
    var numOfUnderscore = wordToGuess.filter(x => x == '_').length;
    fillIndex = chosenWord.length - numOfUnderscore;
    wordToGuess[fillIndex] = letter;
    wordContainer.innerHTML = wordToGuess.join(" ");
    wordIndexs.push(index);

    document.getElementById(`${currentCard}-${index}`).disabled = true;
    document.getElementById("remove-btn").disabled = false;

    if (!wordToGuess.includes('_')) {
        wordContainer.innerHTML = wordToGuess.join("");
        if (wordToGuess.join("") == card.en) {
            wordContainer.classList.add("correct");

            document.getElementById("remove-btn").disabled = true;
            if (currentCard != questions.length - 1) {
                document.getElementById("next").disabled = false;
            }

            card.wordToGuess = card.en
            card.disabled = true;

            if (questions.filter(x => x.disabled).length == questions.length) {
                var popup = document.getElementById('popup');
                popup.style.display = 'block';
                document.getElementsByClassName("container")[0].style.opacity = ".4";
            }
        } else {
            wordContainer.classList.add("incorrect");
        }
    }
}

const remove = () => {
    var card = questions[currentCard];
    var wordToGuess = card.wordToGuess;
    wordContainer.classList.remove("incorrect");

    var numOfUnderscore = wordToGuess.filter(x => x == '_').length;
    var index = chosenWord.length - numOfUnderscore - 1;
    
    var removeIndex = wordIndexs[index];
    wordIndexs.splice(index);

    wordToGuess[index] = '_';
    wordContainer.innerHTML = wordToGuess.join(" ");

    document.getElementById(`${currentCard}-${removeIndex}`).disabled = false;

    numOfUnderscoreAfterRemove = numOfUnderscore + 1;
    if (numOfUnderscoreAfterRemove == 0 || numOfUnderscoreAfterRemove == card.words.length) {
        document.getElementById("remove-btn").disabled = true;
    } else {
        document.getElementById("remove-btn").disabled = false;
    }
}

const previous = () => {
    if (currentCard > 0) {
        currentCard--;
        showCurrentCard();
    }
    
    document.getElementById("previous").disabled = currentCard == 0;
    document.getElementById("next").disabled = false;
}

const next = () => {
    if (currentCard < questions.length - 1) {
        currentCard++;
        showCurrentCard();
    }

    document.getElementById("previous").disabled = false;
    document.getElementById("next").disabled = !questions[currentCard].disabled
        || currentCard == questions.length - 1;
}

fetchData();