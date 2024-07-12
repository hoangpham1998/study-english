const quizContainer = document.getElementById('quiz-container');
let currentCard = 0;
let totalCorrect = 0;
let totalIncorrect = 0;

var url = new URL(window.location.href);
var book = url.searchParams.get("book");
var unit = url.searchParams.get("unit");

const fetchData = () => {
    fetch(`assets\\data\\4000-enssential-english-words\\books\\book-${book}.json`)
    .then(response => response.json())
    .then(data => {
        var unitData = data[unit - 1];
        var date = new Date();
        for (let i = unitData.length - 1; i > 0; i--) {
            unitData[i].dueDate = date;
            unitData[i].disabled = false;
            
            const j = Math.floor(Math.random() * (i + 1));
            [unitData[i], unitData[j]] = [unitData[j], unitData[i]];
        }

        questions = unitData;
        showCurrentCard();
        document.getElementById("previous").disabled = true;
    });
}

// Display current flashcard
const showCurrentCard = () => {
    let card = questions[currentCard];
    if (!card)
        return;

    if (!card.isGen) {
        let answer = [currentCard, getRandomValue(), getRandomValue(), getRandomValue()];
        for (let i = answer.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answer[i], answer[j]] = [answer[j], answer[i]];
        }

        card.aIndex = answer[0];
        card.bIndex = answer[1];
        card.cIndex = answer[2];
        card.dIndex = answer[3];
        
        card.isGen = true;
    }
    
    quizContainer.innerHTML = `<span class="quiz-status">${currentCard}/${questions.length}</span>
        <h2>${card.vi}</h2>
        <ul class="answer-options">
            <li>
                <input type="radio" ${card.disabled ? "disabled" : ""} id="${currentCard}-${card.aIndex}" name="${currentCard}" value="${card.aIndex}">
                <label for="${currentCard}-${card.aIndex}">${questions[card.aIndex].en}</label>
            </li>
            <li>
                <input type="radio" ${card.disabled ? "disabled" : ""} id="${currentCard}-${card.bIndex}" name="${currentCard}" value="${card.bIndex}">
                <label for="${currentCard}-${card.bIndex}">${questions[card.bIndex].en}</label>
            </li>
            <li>
                <input type="radio" ${card.disabled ? "disabled" : ""} id="${currentCard}-${card.cIndex}" name="${currentCard}" value="${card.cIndex}">
                <label for="${currentCard}-${card.cIndex}">${questions[card.cIndex].en}</label>
            </li>
            <li>
                <input type="radio" ${card.disabled ? "disabled" : ""} id="${currentCard}-${card.dIndex}" name="${currentCard}" value="${card.dIndex}">
                <label for="${currentCard}-${card.dIndex}">${questions[card.dIndex].en}</label>
            </li>
        </ul>`;

    setCorrect();
    setIncorrect(card.incorrectIndex);
};

const getRandomValue = () => Math.floor(Math.random() * questions.length);

const previous = () => {
    if (currentCard > 0) {
        currentCard--;
        showCurrentCard();
        
        document.getElementById("submit").disabled = questions[currentCard].disabled;
    }
    
    document.getElementById("previous").disabled = currentCard == 0;
    document.getElementById("next").disabled = false;
}

const next = () => {
    if (currentCard < questions.length - 1) {
        currentCard++;
        showCurrentCard();

        document.getElementById("submit").disabled = questions[currentCard].disabled;
    }

    document.getElementById("previous").disabled = false;
    document.getElementById("next").disabled = currentCard == questions.length - 1;
}

const submit = () => {
    var selectedAnswer = document.querySelector(`input[name="${currentCard}"]:checked`);
    if (!selectedAnswer) {
        alert("Please select an answer.");
        return;
    }

    questions[currentCard].disabled = true;
    
    var answer = selectedAnswer.value;
    setCorrect();

    if (answer != currentCard) {
        questions[currentCard].incorrectIndex = answer;
        setIncorrect(answer);
        totalIncorrect++;
    }
    else {
        totalCorrect++;
    }

    document.querySelectorAll(`input[name="${currentCard}"]`).forEach(input => {
        input.disabled = true;
        input.nextElementSibling.style.cursor = "not-allowed";
    });

    document.getElementById("total-correct").textContent = totalCorrect;
    document.getElementById("total-incorrect").textContent = totalIncorrect;

    var totalAnswered = questions.filter(x => x.disabled).length;
    document.getElementById("total-answered").textContent = totalAnswered;

    document.getElementById("submit").disabled = questions[currentCard].disabled;

    if (questions.filter(x => x.disabled).length == questions.length - 1)
        alert("Quiz completed!");
}

const setCorrect = () => {
    if (!questions[currentCard].disabled)
        return;

    var correctAnsStyle = document.getElementById(`${currentCard}-${currentCard}`).nextElementSibling.style;
    correctAnsStyle.backgroundColor = "#8bc34a";
    correctAnsStyle.borderColor = "rgb(105 195 0)";
    correctAnsStyle.color = "#ffffff";
}

const setIncorrect = (index) => {
    if (!questions[currentCard].disabled || !index)
        return;
    
    var selectedAnsStyle = document.getElementById(`${currentCard}-${index}`).nextElementSibling.style;
    selectedAnsStyle.backgroundColor = "#f44336";
    selectedAnsStyle.borderColor = "rgb(255 47 32)";
    selectedAnsStyle.color = "#ffffff";
}

fetchData();