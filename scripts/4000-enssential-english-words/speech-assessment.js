//#region Init
let wordIndex = 0;
let wordList = [];
let countPercent = 5;
let progressStatus = 0;

const progressBar = document.getElementById("progress-bar");
const preBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const wordInfo = document.getElementById("word-info");
const wordDetail = document.getElementById("word-detail");
//#endregion

//#region Load data
const showDetail = () => {
    wordDetail.classList.toggle('active');
}

const initWord = () => {
    document.getElementById("result").style.display = "none";
    wordDetail.classList.remove('active')
    listenBtn.style.display = "none";
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
    openSoundBtn.disabled = false;
    listenBtn.disabled = false;
}

const displayWord = () => {
    let header = document.getElementById('header');
    let footer = document.getElementById('footer');
    var remainHeight = header.offsetHeight + progressBar.offsetHeight + footer.offsetHeight + 50;
    container.style.height = `calc(100vh - ${remainHeight}px)`;
    if (wordList.length > 0) {
        initWord();

        let word = wordList[wordIndex];
        let pron = word.pron.split('] ');
        let partOfSpeech = getPartOfSpeech(pron[1]);
        let phoneme = `${pron[0].replace('[', '/')}/`;

        wordInfo.innerHTML = `
            <span id="word-en">${word.en}</span>
            <span id="word-type">${partOfSpeech}</span><br />
            <span id="word-pron">${phoneme}</span>
        `;

        wordDetail.innerHTML = `
            <p class="detail">
                <span class="card-detail">Vietnamese: </span>
                <span id="word-vi">${word.vi}</span>
            </p>
            <p class="detail">
                <span class="card-detail">Description: </span>
                <span id="word-desc">${word.desc}</span>
            </p>
            <div style="font-style: italic">
                <span class="card-detail">Example: </span>
                <span id="word-exam">${word.exam}</span>
            </div>
        `;
    }
};

const getWordList = async () => {
    wordList = await getDataBook(true);
    countPercent = 100 / wordList.length;
    progressStatus = countPercent;
    progressBar.style.width = `${progressStatus}%`;
    displayWord();
    initRecorder();
}

getWordList();
//#endregion

const speech = () => {
    speechText(wordList[wordIndex].en);
}

const listen = () => {
    listenRecord(wordList[wordIndex].tokenId);
}

const startRecord = () => {
    if (!canRecord || !recorder.canRecord)
        return;

    let currentIndex = wordIndex;
    let word = wordList[wordIndex];
    const params = Object.assign({
        coreType: CORE_TYPE.WORD,
        refText: word.en,
        question_prompt: word.en,
        userId: SPEECH_ASSESSMENT.USER_ID
    }, settingForm, serverParams);
    recorder.record({
        duration: duration,
        serverParams: params,
        onRecordIdGenerated: (id, token) => { },
        onStart: () => {
            startSpeech();
        },
        onStop: () => {
            recordProgress = 0;
            clearInterval(recordTimer);
            clearTimeout(timeoutId);
        },
        onComplete: (result) => {
            enableAction();
            const response = JSON.parse(result);
            //console.log("response: ", response)
            if (response.error) {
                isRecording = false;
                clearInterval(recordTimer);
                clearTimeout(timeoutId);
                recordProgress = 0;
                return;
            }
            if (wordIndex == currentIndex && response.eof === 1) {
                var responseResult = response.result;
                isRecording = false;
                word.tokenId = response.tokenId;
                getWordResults(responseResult);
            }
        },
        onError: () => {
            isRecording = false;
            pronResult = null;
            clearInterval(recordTimer);
            clearTimeout(timeoutId);
            recordProgress = 0;
        }
    });

    timeoutId = setTimeout(() => {
        if (isRecording && wordIndex == currentIndex) {
            stopRecord();
        }
    }, SPEECH_ASSESSMENT.TIMEOUT);
}

const previous = () => {
    if (wordIndex > 0) {
        wordIndex--;
        displayWord();

        progressStatus -= countPercent;
        progressBar.style.width = `${progressStatus}%`;
    }

    preBtn.disabled = wordIndex == 0;
    nextBtn.disabled = false;
}

const next = () => {
    if (wordIndex < wordList.length - 1) {
        wordIndex++;
        displayWord();

        progressStatus += countPercent;
        progressBar.style.width = `${progressStatus}%`;
    }

    preBtn.disabled = false;
    nextBtn.disabled = wordIndex == wordList.length - 1;
}