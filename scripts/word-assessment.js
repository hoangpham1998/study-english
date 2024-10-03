const startBtn = document.getElementById('start-record');
const stopBtn = document.getElementById('stop-record');
const listenBtn = document.getElementById('listen-voice');
const openSoundBtn = document.getElementById('open-sound');
const recordAudio = document.getElementById("record-audio");
let timeoutId;

const enableAction = () => {
    listenBtn.style.display = "inline-block";
    openSoundBtn.disabled = false;
    listenBtn.disabled = false;
}

const stopRecord = () => {
    recorder.stop({
        onStop: () => {
            recordProgress = 0;
            clearInterval(recordTimer);
            clearTimeout(timeoutId);
        }
    });

    clearTimeout(timeoutId);
    isRecording = false;
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
    if (percent < SCORE_RANGE.MIN) {
        stroke = SCORE_RESULT_COLOR.BAD;
    } else if (percent >= SCORE_RANGE.MIN && percent < SCORE_RANGE.MAX) {
        stroke = SCORE_RESULT_COLOR.GOOD;
    } else if (percent >= SCORE_RANGE.MAX) {
        stroke = SCORE_RESULT_COLOR.EXCELLENT;
    }
    progressCircle.style.stroke = stroke;
    document.getElementById("word-stress-result").style.color = stroke;

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
    words[0].phonics.forEach(function (word) {
        word.phoneme.forEach(function (phoneme) {
            phonemeArray.push({
                overall: word.overall,
                phoneme: phoneme
            });
        });
    });
    if (words[0].scores.stress.length > 1) {
        words[0].scores.stress.forEach(function (stress) {
            if (stress.ref_stress === 1) {
                phonemeArray[stress.phoneme_offset].phoneme = "ˈ" + phonemeArray[stress.phoneme_offset].phoneme;
            }
        });
    }

    return `/${phonemeArray
        .map(item => getSpanResult(item.overall, item.phoneme))
        .join("")}/`;
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
        return `You pronounced the correct word stress. It’s on the <span id="ref-stress">${getOrdinalNumberSuffixes(refStressIndex + 1)}</span> syllable.
        <span id="show-detail" onclick="showPhonemeDetail()">Detail</span>`;
    }

    return "You pronounced the wrong word stress. "
        + (actStressIndex === -1 ? "" : `It’s on the <span id="ref-stress">${getOrdinalNumberSuffixes(actStressIndex + 1)}</span> syllable.`)
        + `You should stress the <span id="ref-stress">${getOrdinalNumberSuffixes(refStressIndex + 1)}</span> syllable.
        <span id="show-detail" onclick="showPhonemeDetail()">Detail</span>`;
}

const showPhonemeDetail = () => {
    document.getElementById('popup').style.display = 'block';
    document.getElementsByClassName("container")[0].style.opacity = ".4";
}

const getPhonemeLevelResults = (words) => {
    if (!words) {
        return "";
    }

    var result = "";
    words[0].phonics.forEach((phonic, i) => {
        var phonemes = words[0].phonemes[i];
        var overall = phonic.overall;

        var errorType = PHONEME_ERROR_TYPE.DELETION;
        if (phonemes.inserted_before.length > 0 || phonemes.inserted_after.length > 0) {
            errorType = PHONEME_ERROR_TYPE.INSERTION;
        } else if (phonemes.sound_like !== "-" && phonemes.sound_like !== phonemes.phoneme) {
            errorType = PHONEME_ERROR_TYPE.SUBSTITUTION;
        } else if (phonemes.sound_like === "-") {
            errorType = PHONEME_ERROR_TYPE.DELETION;
        }

        result += `<tr style="color: ${getColor(overall)}">
            <td class="phonic-spell">${phonic.spell}</td>
            <td class="phonic-sound">/${phonic.phoneme.join('')}/</td>
            <td class="phonic-score">${overall}</td>
            <td class="phonic-sound-like">${phonemes.sound_like}</td>
            <td class="phonic-mispron">${errorType}</td>
        </tr>`
    });

    return result;
}

const getColor = (score) => {
    if (score >= SCORE_RANGE.MAX) {
        return SCORE_RESULT_COLOR.EXCELLENT;
    } else if (score >= SCORE_RANGE.MIN && score < SCORE_RANGE.MAX) {
        return SCORE_RESULT_COLOR.GOOD;
    } else if (score < SCORE_RANGE.MIN) {
        return SCORE_RESULT_COLOR.BAD;
    }
    return SCORE_RESULT_COLOR.BAD;
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

const startSpeech = () => {
    startTimer();

    startBtn.style.display = "none";
    stopBtn.style.display = "block";
    openSoundBtn.disabled = true;
    listenBtn.disabled = true;
}

const getWordResults = (responseResult) => {
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
        document.getElementById('phoneme-level-result').innerHTML = getPhonemeLevelResults(wordsResult);
    }

    setProgress(responseResult.overall ?? 0);

    stopRecord();
}

//#region Sentence Evaluation
const getSentResult = (words) => {
    if (!words) {
        return "";
    }

    return words.map(e => {
        let wordCheck = e.word;
        if (e.charType === 1) {
            return getSpanTag(SCORE_RESULT_COLOR.NORMAL, wordCheck);
        }
        return getSpanResult(e.scores.pronunciation, wordCheck);
    }).join(" ");
}

const getPhonemeSentenceResults = (words) => {
    if (!words) {
        return "";
    }

    var phonemes = words.map(w => {
        return w.phonemes
            .map(e => getSpanResult(e.pronunciation, e.phoneme))
            .join("");
    }).join(" ");

    return `/${phonemes}/`;
}

const showPhoneme = (i) => {
    document.getElementById(`open-${i}`).style.display = "none";
    document.getElementById(`close-${i}`).style.display = "block";
    document.querySelectorAll(`.detail-${i}`)
        .forEach(x => x.style.display = "table-row");
}

const hidePhoneme = (i) => {
    document.getElementById(`open-${i}`).style.display = "block";
    document.getElementById(`close-${i}`).style.display = "none";
    document.querySelectorAll(`.detail-${i}`)
        .forEach(x => x.style.display = "none");
}

const getWordLevelResults = (words) => {
    if (!words) {
        return "";
    }

    let result = "";
    words.forEach((word, i) => {
        var color = getColor(word.scores.overall);
        result += `<tr class="word" style="color: ${color}">
            <td>${word.word}</td>
            <td>${word.scores.overall}</td>
            <td>
                <i onclick="showPhoneme(${i})" id="open-${i}" class="fa-solid fa-chevron-down"></i>
                <i onclick="hidePhoneme(${i})" id="close-${i}" class="fa-solid fa-chevron-up" style="display: none"></i>
            </td>
        </tr>`;

        word.phonemes.forEach(phoneme => {
            let remark = "";
            if (phoneme.sound_like == '-') {
                remark = "Not pronounced";
            }
            else if (phoneme.sound_like != phoneme.phoneme) {
                remark = `/${phoneme.phoneme}/ sounds like /${phoneme.sound_like}}/`
            }
            if (phoneme.inserted_after.length) {
                remark = `/${phoneme.inserted_after.join('')}/ inserted finally`
            }

            result += `<tr class="detail-${i} word-child" style="display: none; color: ${getColor(phoneme.pronunciation)}">
                <td>/${phoneme.phoneme}/</td>
                <td>${phoneme.pronunciation}</td>
                <td>${remark}</td>
            </tr>`;
        });
    });

    return result;
}

const getSentenceResults = (responseResult) => {
    console.log("response: ", responseResult)
    wordsResult = responseResult.words;

    document.getElementById("result").style.display = "block";

    var phonicsResult = getSentResult(wordsResult);
    if (phonicsResult !== "") {
        document.getElementById("word-en").innerHTML = phonicsResult;
    }

    var pronResult = getPhonemeSentenceResults(wordsResult);
    if (pronResult !== "") {
        document.getElementById("word-pron").innerHTML = pronResult;
    }

    document.getElementById("word-stress-result").innerHTML =
        `You used ${responseResult.rear_tone === TONE_TYPE.FALL
            ? TONE_TYPE.FALLING : TONE_TYPE.RISING} tone at the end of the sentence.
        <span id="show-detail" onclick="showPhonemeDetail()">Detail</span>`;

    document.getElementById("pronun-score").innerHTML =
        getSpanResult(responseResult.pronunciation, responseResult.pronunciation);
    document.getElementById("fluency-score").innerHTML =
        getSpanResult(responseResult.fluency, responseResult.fluency);
    document.getElementById("integrity-score").innerHTML =
        getSpanResult(responseResult.integrity, responseResult.integrity);
    document.getElementById("rhythm-score").innerHTML =
        getSpanResult(responseResult.rhythm, responseResult.rhythm);
    document.getElementById("speed-score").innerHTML =
        getSpanResult(responseResult.speed, responseResult.speed);

    document.getElementById('phoneme-level-result').innerHTML = getWordLevelResults(wordsResult);

    setProgress(responseResult.overall ?? 0);

    stopRecord();
}
//#endregion