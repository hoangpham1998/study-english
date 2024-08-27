const SPEECH_ASSESSMENT = {
    UUID_FORMAT: "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",
    BASE_URL: "https://api.speechsuper.com/",
    APP_KEY: "16467320730000a7",
    SECRET_KEY: "68078c49b31235e0bf1091ecb9d380b1",
    CORE_TYPE: "word.eval.promax",
    AUDIO_TYPE: "spx",
    SAMPLE_RATE: 16000,
    USER_ID: "guest",
    SDK_VERSION: 16777472,
    SDK_SOURCE: 9,
    SDK_PROTOCOL: 2,
    CHANNEL: 1,
    SAMPLE_BYTES: 2,
    DICT_TYPE: "IPA88",
    DICT_DIALECT: "en_us",
    PHONEME_OUTPUT: 1,
    PRECISION: 1,
    GET_PARAM: 1,
    SLACK: 0,
    AGE_GROUP: 2,
    PHONEME_DIAGNOSIS: 0,
    DURATION: 3000
}

const TEXT_TO_SPEECH = {
    WORD_URL: "https://dailydictation.com/tts/en",
    BASE_URL: "https://audio.api.speechify.com/generateAudioFiles",
    VI_OPTION: {
        engine: "azure",
        languageCode: "vi-VN",
        name: "hoaimy"
    },
    EN_OPTION: {
        name: "snoop",
        engine: "resemble",
        languageCode: "en-US"
    }
}

const PATH = {
    ESSENTIAL: "assets/data/4000-enssential-english-words/"
}

const CARD_STATUS = {
    NEW: 0,
    LEARNING: 1,
    MEMORIZED: 2,
}

const CARD_RATING = {
    AGAIN: 0,
    HARD: 1,
    EXCELLENT: 2,
    EASY: 3
}

const PART_OF_SPEECH = {
    NOUND: "n.",
    PRONOUN: "pron.",
    VERB: "v.",
    ADJECTIVE: "adj.",
    ADVERB: "adv.",
    PREPOSITION: "prep.",
    CONJUNCTION: "conj.",
    INTERJECTION: "int."
}

const SCORE_RESULT_COLOR = {
    NORMAL: "E6E6E6",
    BAD: "#F53D36",
    GOOD: "#FFBD0D",
    EXCELLENT: "#43D217"
}

const ORDINAL_NUMBER_SUFFIXES = {
    ST: "st",
    ND: "nd",
    RD: "rd",
    TH: "th",
}