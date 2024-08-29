const openQuiz = () => {
    location.href = `quiz.html?book=${book}&unit=${unit}`;
}

const openStory = () => {
    location.href = `story.html?book=${book}&unit=${unit}`;
}

const openFlashcard = () => {
    location.href = `flashcard.html?book=${book}&unit=${unit}`;
}

const openScrambleWords = () => {
    location.href = `scramble-words.html?book=${book}&unit=${unit}`;
}

const openSpeechAssessment = () => {
    location.href = `speech-assessment.html?book=${book}&unit=${unit}`;
}

const back = () => {
    location.href = `flashcard-list.html?book=${book}`;
}