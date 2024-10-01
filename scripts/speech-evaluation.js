const inputWord = document.getElementById('input-word');
const wordEn = document.getElementById('word-en');
const inputWordBtn = document.getElementById('btn-input-word');
const saveWordBtn = document.getElementById('btn-save-word');
let tokenId = "";

const initWord = () => {
    let header = document.getElementById('header');
    let footer = document.getElementById('footer');
    var remainHeight = header.offsetHeight + footer.offsetHeight;
    container.style.height = `calc(100vh - ${remainHeight}px)`;

    document.getElementById("result").style.display = "none";
    listenBtn.style.display = "none";
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
    openSoundBtn.disabled = false;
    listenBtn.disabled = false;

    initRecorder();
}

initWord();

const editWord = () => {
    inputWord.style.display = "block";
    saveWordBtn.style.display = "block";
    wordEn.style.display = "none";
    inputWordBtn.style.display = "none";
    openSoundBtn.disabled = true;
    listenBtn.disabled = true;
    document.getElementById("word-pron").textContent = "";
}

const saveWord = () => {
    inputWord.style.display = "none";
    saveWordBtn.style.display = "none";
    wordEn.style.display = "block";
    inputWordBtn.style.display = "block";
    openSoundBtn.disabled = false;
    listenBtn.disabled = false;
    wordEn.textContent = inputWord.value;
}

const listen = () => {
    listenRecord(tokenId);
}

const startRecord = (coreType = CORE_TYPE.WORD) => {
    if (!canRecord || !recorder.canRecord)
        return;

    inputWordBtn.disabled = true;
    saveWord();
    let wordText = document.getElementById("word-en").textContent;
    const params = Object.assign({
        coreType: coreType,
        refText: wordText,
        question_prompt: wordText,
        userId: SPEECH_ASSESSMENT.USER_ID
    }, settingForm, serverParams);
    recorder.record({
        duration: duration,
        serverParams: params,
        onRecordIdGenerated: (id, token) => { },
        onStart: () => {
            isRecording = true;
            startSpeech();
        },
        onStop: () => {
            recordProgress = 0;
            clearInterval(recordTimer);
        },
        onComplete: (result) => {
            enableAction();
            inputWordBtn.disabled = false;
            const response = JSON.parse(result);
            //console.log("response: ", response)
            if (response.error) {
                isRecording = false;
                clearInterval(recordTimer);
                recordProgress = 0;
                return;
            }
            if (response.eof === 1) {
                var responseResult = response.result;
                isRecording = false;
                tokenId = response.tokenId;

                if (coreType === CORE_TYPE.SENTENCES) {
                    getSentenceResults(responseResult)
                } else {
                    getWordResults(responseResult);
                }
            }
        },
        onError: () => {
            isRecording = false;
            clearInterval(recordTimer);
            recordProgress = 0;
        }
    });

    let timeout = coreType === CORE_TYPE.SENTENCES 
        ? SPEECH_ASSESSMENT.SENTENCE_TIMEOUT
        : SPEECH_ASSESSMENT.TIMEOUT * 2
    setTimeout(() => {
        if (isRecording) {
            stopRecord();
        }
    }, timeout);
}