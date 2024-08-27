let currentCard = 0;
let questions = [];
const preBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");

const fetchData = async () => {
    var unitData = await getDataBook();
    
    for (let i = unitData.length - 1; i > 0; i--) {
        unitData[i].disabled = false;
        
        const j = Math.floor(Math.random() * (i + 1));
        [unitData[i], unitData[j]] = [unitData[j], unitData[i]];
    }
    
    questions = unitData;
    showCurrentCard();

    preBtn.disabled = true;
    nextBtn.disabled = true;
}

const showCurrentCard = () => {
    let card = questions[currentCard];
    if (!card)
        return;

    if (!card.isGen) {
        let answer = [currentCard];
        while (answer.length < 4) {
            let newValue = Math.floor(Math.random() * questions.length);
            if (!answer.includes(newValue)) {
                answer.push(newValue);
            }
        }

        answer = shuffleData(answer);
        card.aIndex = answer[0];
        card.bIndex = answer[1];
        card.cIndex = answer[2];
        card.dIndex = answer[3];
        
        card.isGen = true;
    }
    
    container.innerHTML = `<span class="quiz-status">${currentCard + 1}/${questions.length}</span>
        <h2>${card.vi}</h2>
        <ul class="answer-options">
            <li>
                <input onclick="check(${card.aIndex})" type="radio" ${card.disabled ? "disabled" : ""}
                    id="${currentCard}-${card.aIndex}" name="${currentCard}" value="${card.aIndex}">
                <label for="${currentCard}-${card.aIndex}">${questions[card.aIndex].en}</label>
            </li>
            <lix>
                <input onclick="check(${card.bIndex})" type="radio" ${card.disabled ? "disabled" : ""}
                    id="${currentCard}-${card.bIndex}" name="${currentCard}" value="${card.bIndex}">
                <label for="${currentCard}-${card.bIndex}">${questions[card.bIndex].en}</label>
            </li>
            <li>
                <input onclick="check(${card.cIndex})" type="radio" ${card.disabled ? "disabled" : ""}
                    id="${currentCard}-${card.cIndex}" name="${currentCard}" value="${card.cIndex}">
                <label for="${currentCard}-${card.cIndex}">${questions[card.cIndex].en}</label>
            </li>
            <li>
                <input onclick="check(${card.dIndex})" type="radio" ${card.disabled ? "disabled" : ""}
                    id="${currentCard}-${card.dIndex}" name="${currentCard}" value="${card.dIndex}">
                <label for="${currentCard}-${card.dIndex}">${questions[card.dIndex].en}</label>
            </li>
        </ul>`;

    setCorrect();
    setIncorrect(card.incorrectIndex);
};

const previous = () => {
    if (currentCard > 0) {
        currentCard--;
        showCurrentCard();
    }
    
    preBtn.disabled = currentCard == 0;
    nextBtn.disabled = false;
}

const next = () => {
    if (currentCard < questions.length - 1) {
        currentCard++;
        showCurrentCard();
    }

    preBtn.disabled = false;
    nextBtn.disabled = !questions[currentCard].disabled
        || currentCard == questions.length - 1;
}

const check = (answer) => {
    document.querySelectorAll(`input[name="${currentCard}"]`).forEach(input => {
        if (input.nextElementSibling.classList.contains("incorrect")) {
            input.nextElementSibling.classList.remove("incorrect");
        }
    });

    if (answer != currentCard) {
        questions[currentCard].incorrectIndex = answer;
        setIncorrect(answer);
    }
    else {
        questions[currentCard].disabled = true;
        setCorrect();
    }

    if (questions.filter(x => x.disabled).length == questions.length) {
        var popup = document.getElementById('popup');
        popup.style.display = 'block';
        document.getElementsByClassName("container")[0].style.opacity = ".4";
    }
}

const setCorrect = () => {
    if (!questions[currentCard].disabled)
        return;

    document.getElementById(`${currentCard}-${currentCard}`)
        .nextElementSibling.classList.add("correct");

    if (currentCard != questions.length - 1) {
        nextBtn.disabled = false;
    }
}

const setIncorrect = (index) => {
    if (questions[currentCard].disabled || index == null)
        return;
    
    document.getElementById(`${currentCard}-${index}`)
        .nextElementSibling.classList.add("incorrect");
}

fetchData();