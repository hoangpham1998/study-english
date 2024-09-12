
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
        }
    });

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

        var color = SCORE_RESULT_COLOR.BAD;
        if (overall >= SCORE_RANGE.MAX) {
            color = SCORE_RESULT_COLOR.EXCELLENT;
        } else if (overall >= SCORE_RANGE.MIN && overall < SCORE_RANGE.MAX) {
            color = SCORE_RESULT_COLOR.GOOD;
        } else if (overall < SCORE_RANGE.MIN) {
            color = SCORE_RESULT_COLOR.BAD;
        }

        var errorType = PHONEME_ERROR_TYPE.DELETION;
        if (phonemes.inserted_before.length > 0 || phonemes.inserted_after.length > 0) {
            errorType = PHONEME_ERROR_TYPE.INSERTION;
        } else if (phonemes.sound_like !== "-" && phonemes.sound_like !== phonemes.phoneme) {
            errorType = PHONEME_ERROR_TYPE.SUBSTITUTION;
        } else if (phonemes.sound_like === "-") {
            errorType = PHONEME_ERROR_TYPE.DELETION;
        }

        result += `<tr style="color: ${color}">
            <td class="phonic-spell">${phonic.spell}</td>
            <td class="phonic-sound">/${phonic.phoneme.join('')}/</td>
            <td class="phonic-score">${overall}</td>
            <td class="phonic-sound-like">${phonemes.sound_like}</td>
            <td class="phonic-mispron">${errorType}</td>
        </tr>`
    });

    return result;
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

const getSpeechResults = (responseResult) => {
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