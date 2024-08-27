//#region Init
let wordIndex = 0;
let wordList = [];
let countPercent = 5;
let progressStatus = 0;

let mediaRecorder;
let audioChunks = [];
let recording = false;

//const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let saUrl = SPEECH_ASSESSMENT.BASE_URL + SPEECH_ASSESSMENT.CORE_TYPE;
var connectSig = getConnectSig();
var startSig = getStartSig();
var params = {
    connect: {
        cmd: "connect",
        param: {
            sdk: {
                version: SPEECH_ASSESSMENT.SDK_VERSION,
                source: SPEECH_ASSESSMENT.SDK_SOURCE,
                protocol: SPEECH_ASSESSMENT.SDK_PROTOCOL
            },
            app: {
                applicationId: SPEECH_ASSESSMENT.APP_KEY,
                sig: connectSig.sig,
                timestamp: connectSig.timestamp
            }
        }
    },
    start: {
        cmd: "start",
        param: {
            app: {
                applicationId: SPEECH_ASSESSMENT.APP_KEY,
                sig: startSig.sig,
                userId: startSig.userId,
                timestamp: startSig.timestamp
            },
            audio: {
                audioType: SPEECH_ASSESSMENT.AUDIO_TYPE,
                sampleRate: SPEECH_ASSESSMENT.SAMPLE_RATE,
                channel: SPEECH_ASSESSMENT.CHANNEL,
                sampleBytes: SPEECH_ASSESSMENT.SAMPLE_BYTES
            },
            request: {
                coreType: SPEECH_ASSESSMENT.CORE_TYPE,
                tokenId: createUUID()
                // getParam: SPEECH_ASSESSMENT.GET_PARAM,
                // precision: SPEECH_ASSESSMENT.PRECISION,
                // dict_type: SPEECH_ASSESSMENT.DICT_TYPE,
                // phoneme_output: SPEECH_ASSESSMENT.PHONEME_OUTPUT,
                // slack: 0,
                // userId: SPEECH_ASSESSMENT.USER_ID,
                // agegroup: 2,
                // dict_dialect: SPEECH_ASSESSMENT.DICT_DIALECT,
                // phoneme_diagnosis: SPEECH_ASSESSMENT.PHONEME_DIAGNOSIS,
                // duration: SPEECH_ASSESSMENT.DURATION
            }
        }
    }
};

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
        openSoundBtn.disabled = false;
        listenBtn.disabled = false;
        audioChunks = [];

        let word = wordList[wordIndex];
        params.start.param.request.refText = word.en;
        //params.start.param.request.question_prompt = word.en;

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
            <div style="font-styleitalic">
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
    recordAudio.play();
}

const startRecord = () => {
    // let audioRequest = params.start.param.audio;
    // let request = params.start.param.request;
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks);
            // const arrayBuffer = await audioBlob.arrayBuffer();
            // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            // request.duration = audioBuffer.duration;
            // audioRequest.duration = audioBuffer.duration;
            // audioRequest.sampleRate = audioBuffer.sampleRate;
            // audioRequest.channel = audioBuffer.numberOfChannels;

            const formData = new FormData();
            formData.append("audio", audioBlob, `record-${request.tokenId}.${audioRequest.audioType}`);
            formData.append("text", JSON.stringify(params));

            console.log(JSON.stringify(params));

            var xhr = new XMLHttpRequest();
            xhr.open("post", saUrl);
            xhr.setRequestHeader("Request-Index", "0");
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                    const result = JSON.parse(xhr.responseText).result;
                    console.log(JSON.parse(xhr.responseText));
                    document.getElementById("result").style.display = "block";

                    var wordResult = getWordResult(result.words);
                    if (wordResult !== "") {
                        document.getElementById("word-en").innerHTML = wordResult;
                    }

                    var pronResult = getPhonemeResults(result.words);
                    if (pronResult !== "") {
                        document.getElementById("word-pron").innerHTML = pronResult;
                    }
                    var wordStressResult = getWordStressResult(result.words);
                    if (wordStressResult !== "") {
                        document.getElementById("word-stress-result").innerHTML = wordStressResult;
                    }

                    setProgress(result.overall ?? 0);
                }
            };

            recordAudio.src = URL.createObjectURL(audioBlob);
            
            openSoundBtn.disabled = false;
            listenBtn.disabled = false;
        };
        mediaRecorder.start();
        recording = true;

        recordSound.play();
        
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        openSoundBtn.disabled = true;
        listenBtn.disabled = true;
        audioChunks = [];

        setTimeout(() => {
            stopRecord()
        }, 4000);
    });
}

const stopRecord = () => {
    if (!recording)
        return;

    mediaRecorder.stop();
    recording = false;

    listenBtn.style.display = "inline-block";
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
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
    if (percent < 70) {
        stroke = SCORE_RESULT_COLOR.BAD;
    } else if (percent >= 70 && percent < 85) {
        stroke = SCORE_RESULT_COLOR.GOOD;
    } else if (percent >= 85) {
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

const getWordResult = (words) => {
    if (!words) {
        return "";
    }

    return words[0].phonics
        .map(e => getSpanResult(e.overall, e.spell))
        .join("");
}

const getPhonemeResults = (words) => {
    if (!words) {
        return "";
    }

    var phonemes = words[0].phonemes
        .map(e => getSpanResult(e.pronunciation, e.phoneme))
        .join("");

    return `/${phonemes}/`;
}

const sentResult = (result) => {
    if (!result) {
        return "";
    }
    
    return result.words.map(e => {
        let pronunciation = e.scores.pronunciation;
        let wordCheck = e.word;
        if (e.charType === 1) {
            return getSpanTag(SCORE_RESULT_COLOR.NORMAL, wordCheck);
        } 
        if (pronunciation < 60) {
            return getSpanTag(SCORE_RESULT_COLOR.BAD, wordCheck);
        } 
        if (pronunciation >= 60 && pronunciation < 80) {
            return getSpanTag(SCORE_RESULT_COLOR.GOOD, wordCheck);
        } 
        if (pronunciation >= 80) {
            return getSpanTag(SCORE_RESULT_COLOR.EXCELLENT, wordCheck);
        }
        return "";
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
    if (score < 70) {
        return getSpanTag(SCORE_RESULT_COLOR.BAD, word);
    }
    if (score >= 70 && score < 85) {
        return getSpanTag(SCORE_RESULT_COLOR.GOOD, word);
    }
    if (score >= 85) {
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