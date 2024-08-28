//#region Init
let wordIndex = 0;
let wordList = [];
let countPercent = 5;
let progressStatus = 0;

const progressBar = document.getElementById("progress-bar");
const startBtn = document.getElementById('start-record');
const stopBtn = document.getElementById('stop-record');
const listenBtn = document.getElementById('listen-voice');
const openSoundBtn = document.getElementById('open-sound');
const preBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const recordSound = document.getElementById("record-sound");
const recordAudio = document.getElementById("record-audio");
const wordInfo = document.getElementById("word-info");
const wordDetail = document.getElementById("word-detail");
//#endregion

//#region Load data
const showDetail = () => {
    wordDetail.classList.toggle('active');
}

const displayWord = () => {
    if (wordList.length > 0) {
        document.getElementById("result").style.display = "none";
        listenBtn.style.display = "none";
        startBtn.style.display = "block";
        stopBtn.style.display = "none";
        openSoundBtn.disabled = false;
        listenBtn.disabled = false;

        let word = wordList[wordIndex];

        let pron = word.pron.split('] ');
        let partOfSpeech = getPartOfSpeech(pron[1]);
        let phoneme = `${pron[0].replace('[','/')}/`;

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
}

getWordList();
//#endregion

const speech = () => {
    let word = wordList[wordIndex];
    const audio = new Audio();
    audio.src = `${TEXT_TO_SPEECH.WORD_URL}-US/${word.en}.mp3`
    audio.play();
}

const listen = () => {
    let word = wordList[wordIndex];
    
    recorder.stopReplay({
        recordId: wordList[wordIndex - 1].tokenId
    });
    listenRecord(word.tokenId);
}

const startRecord = () => {
    if (!canRecord || !recorder.canRecord)
        return;

    let word = wordList[wordIndex];
    word.pronResult = null;
    const params = Object.assign({
        coreType: SPEECH_ASSESSMENT.CORE_TYPE,
        refText: word.en,
        question_prompt: word.en,
        userId: SPEECH_ASSESSMENT.USER_ID
    }, settingForm, serverParams);

    recorder.record({
        duration: duration,
        serverParams: params,
        onRecordIdGenerated: (id, token) => { },
        onStart: () => {
            isRecording = true;
            startTimer();

            startBtn.style.display = "none";
            stopBtn.style.display = "block";
            openSoundBtn.disabled = true;
            listenBtn.disabled = true;
        },
        onStop: () => {
            isScoring = true;
            recordProgress = 0;
            clearInterval(recordTimer);
        },
        onComplete: (result) => {
            const response = JSON.parse(result);
            console.log("response: ", response)
            if (response.error) {
                isRecording = false;
                word.pronResult = null;
                clearInterval(recordTimer);
                recordProgress = 0;
                return;
            }
            if (response.eof === 1) {
                var responseResult = response.result;
                isRecording = false;
                word.pronResult = responseResult;
                word.tokenId = response.tokenId;
                wordsResult = responseResult.words;
                
                document.getElementById("result").style.display = "block";

                var phonicsResult = getPhonicsResult(wordsResult);
                if (phonicsResult !== "") {
                    document.getElementById("word-en").innerHTML = phonicsResult;
                }

                var pronResult = getPhonemeResults(wordsResult);
                if (pronResult !== "") {
                    document.getElementById("word-pron").innerHTML = pronResult;
                }
                
                var wordStressResult = getWordStressResult(wordsResult);
                if (wordStressResult !== "") {
                    document.getElementById("word-stress-result").innerHTML = wordStressResult;
                }

                setProgress(word.pronResult.overall ?? 0);

                stopRecord();
            }
        },
        onError: () => {
            isRecording = false;
            pronResult = null;
            clearInterval(recordTimer);
            recordProgress = 0;
        }
    });
}

const stopRecord = () => {
    if (isRecording)
        return;

    recorder.stop({
        onStop: () => {
            isScoring = true;
            recordProgress = 0;
            clearInterval(recordTimer);
        }
    });

    resetUI();
}

const resetUI = () => {
    listenBtn.style.display = "inline-block";
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
    openSoundBtn.disabled = false;
    listenBtn.disabled = false;
}

const setProgress = (percent) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(percent, 0), 100);
    const offset = circumference - (circumference * progress / 100);

    const progressCircle = document.querySelector('.progress-ring__circle');
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = offset;

    let stroke = SCORE_RESULT_COLOR.NORMAL;
    if (percent < SCORE_RANGE.MIN) {
        stroke = SCORE_RESULT_COLOR.BAD;
    } else if (percent >= SCORE_RANGE.MIN && percent < SCORE_RANGE.MAX) {
        stroke = SCORE_RESULT_COLOR.GOOD;
    } else if (percent >= SCORE_RANGE.MAX) {
        stroke = SCORE_RESULT_COLOR.EXCELLENT;
    }
    progressCircle.style.stroke = stroke;

    var strokeFilter = `drop-shadow(0 0 5px ${stroke})`;

    const progressText = document.getElementById('progress-text');
    progressText.textContent = progress;
    progressText.style.color = stroke;
    progressText.style.filter = strokeFilter;

    document.getElementById("progress-ring-circle").style.filter = strokeFilter;
}

const getPhonicsResult = (words) => {
    if (!words) {
        return "";
    }

    return words[0].phonics
        .map(e => getSpanResult(e.overall, e.spell))
        .join("");
}

const getPhonemeResults = (words, withStress = true) => {
    if (!words) {
        return "";
    }

    if (!withStress) {
        var phonemes = words[0].phonemes
        .map(e => getSpanResult(e.pronunciation, e.phoneme))
        .join("");

        return `/${phonemes}/`;
    }

    return wordPhonicsResult(words);
}


const wordPhonicsResult = (words) => {
    if (!words) {
        return "";
    }

    var phonemeArray = [];
    words[0].phonics.forEach(function(word) {
        word.phoneme.forEach(function(phoneme) {
            phonemeArray.push({
                overall: word.overall,
                phoneme: phoneme
            });
        });
    });

    if (words[0].scores.stress.length > 1) {
        words[0].scores.stress.forEach(function(stress) {
            if (stress.ref_stress === 1) {
                phonemeArray[stress.phoneme_offset].phoneme = "ˈ" + phonemeArray[stress.phoneme_offset].phoneme;
            }
        });
    }

    return `/${phonemeArray
        .map(item => getSpanResult(item.overall, item.phoneme))
        .join("")}/`;
}

const sentResult = (result) => {
    if (!result) {
        return "";
    }
    
    return result.words.map(e => {
        let wordCheck = e.word;
        if (e.charType === 1) {
            return getSpanTag(SCORE_RESULT_COLOR.NORMAL, wordCheck);
        }
        return getSpanResult(e.scores.pronunciation, wordCheck);
    }).join(" ");
}

const getWordStressResult = (words) => {
    if (!words) {
        return "";
    }
    
    var refStressIndex = -1;
    var actStressIndex = -1;
    
    words[0].scores.stress.forEach((stressInfo, index) => {
        if (stressInfo.ref_stress === 1) {
            refStressIndex = index;
        }
        if (stressInfo.stress === 1) {
            actStressIndex = index;
        }
    });
    
    if (refStressIndex === -1) {
        return "";
    }
    
    if (refStressIndex === actStressIndex) {
        return `You pronounced the correct word stress. It’s on the <span id="ref-stress">${getOrdinalNumberSuffixes(refStressIndex + 1)}</span> syllable.`;
    }
    
    return "You pronounced the wrong word stress. "
        + (actStressIndex === -1 ? "" : `It’s on the <span id="ref-stress">${getOrdinalNumberSuffixes(actStressIndex + 1)}</span> syllable.`)
        + `You should stress the <span id="ref-stress">${getOrdinalNumberSuffixes(refStressIndex + 1)}</span> syllable.`;
}

const getSpanTag = (color, word) => `<span style='color: ${color}'>${word}</span>`;

const getSpanResult = (score, word) => {
    if (score < SCORE_RANGE.MIN) {
        return getSpanTag(SCORE_RESULT_COLOR.BAD, word);
    }
    if (score >= SCORE_RANGE.MIN && score < SCORE_RANGE.MAX) {
        return getSpanTag(SCORE_RESULT_COLOR.GOOD, word);
    }
    if (score >= SCORE_RANGE.MAX) {
        return getSpanTag(SCORE_RESULT_COLOR.EXCELLENT, word);
    }
    return "";
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