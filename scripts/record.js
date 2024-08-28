let duration = SPEECH_ASSESSMENT.DURATION;
let canRecord = false;
let player = new Audio();
let errorMsg = "";
let recordProgress = 0;
let isRecording = false;
let isPlaying = false;
let recordTimer = 0;
let serverParams = {};
let settingForm = {
    dict_type: SPEECH_ASSESSMENT.DICT_TYPE,
    precision: SPEECH_ASSESSMENT.PRECISION,
    agegroup: SPEECH_ASSESSMENT.AGE_GROUP,
    slack: SPEECH_ASSESSMENT.SLACK,
    phoneme_diagnosis: SPEECH_ASSESSMENT.PHONEME_DIAGNOSIS
};

const initRecorder = () => {
    recorder = createRecorder();
    setupAudioPlayer();
}

const createRecorder = () => {
    return new _17kouyu.IRecorder({
        appKey: SPEECH_ASSESSMENT.APP_KEY,
        secretKey: SPEECH_ASSESSMENT.SECRET_KEY,
        server: SPEECH_ASSESSMENT.WS_SERVER,
        mode: SPEECH_ASSESSMENT.MODE,
        onFlashLoad: (e, t) => {},
        onConnectorStatusChange: (e, t) => {},
        onMicStatusChange: (t, s) => {
            if (50001 == +t) {
                canRecord = true;
            } else {
                canRecord = false;
                errorMsg = "Please allow microphone access to try demo.";
            }
        },
        onError: (e) => {
            console.log("onError", e);
        }
    });
}

const startTimer = () => {
    clearInterval(recordTimer);
    let elapsedTime = 0;
    recordTimer = setInterval(() => {
        elapsedTime += 30;
        if (elapsedTime >= duration) {
            clearInterval(recordTimer);
        } else {
            recordProgress = (elapsedTime / duration) * 100;
        }
    }, 30);
}

const setupAudioPlayer = () => {
    player.pause(),
    player.currentTime = 0,

    player.addEventListener("pause", () => {
        isPlaying = false;
    });

    player.addEventListener("ended", () => {
        isPlaying = false;
    });
}

const listenRecord = (tokenId) => {
    recorder.startReplay({
        recordId: tokenId
    });
}

initRecorder();