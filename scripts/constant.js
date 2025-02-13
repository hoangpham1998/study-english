const AUDIO_TYPE = {
    WAV: "wav",
    MP3: "mp3",
    SPX: "spx"
}

const COUNTRY_CODE = {
    US: "US",
    GB: "GB",
    VN: "VN",
}

const LANGUAGE_CODE = {
    EN_US: "en-US",
    EN_UK: "en-GB",
    VI_VN: "vi-VN",
}

const CORE_TYPE = {
    WORD: "word.eval.promax",
    SENTENCES: "sent.eval.promax",
    PARAGRAPH: "para.eval.promax"
}

const SPEECH_ASSESSMENT = {
    UUID_FORMAT: "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",
    BASE_URL: "https://api.speechsuper.com/",
    WS_SERVER: "wss://gray.stkouyu.com:8443",
    APP_KEY: "16467320730000a7",
    SECRET_KEY: "68078c62c8fc3469bf1091ecb9d380b1",
    MODE: 2,
    AUDIO_TYPE: AUDIO_TYPE.SPX,
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
    AGE_GROUP: 3,
    PHONEME_DIAGNOSIS: 0,
    DURATION: 3000,
    TIMEOUT: 5000,
    SENTENCE_TIMEOUT: 10000
}

const TEXT_TO_SPEECH = {
    WORD_URL: "../../assets/data/tts/",
    BASE_URL: "https://audio.api.speechify.com/generateAudioFiles",
    VI_OPTION: {
        engine: "azure",
        languageCode: LANGUAGE_CODE.VI_VN,
        name: "hoaimy"
    },
    EN_US_OPTION: {
        name: "snoop",
        engine: "resemble",
        languageCode: LANGUAGE_CODE.EN_US
    },
    EN_UK_OPTION: {
        name: "aliabdaal",
        engine: "speechify",
        languageCode: LANGUAGE_CODE.EN_UK
    },
    AUDIO_TYPE: AUDIO_TYPE.MP3
}

const PATH = {
    DEFAULT_ROUTE: "pages/",
    ESSENTIAL_ROUTE: "pages/4000-enssential-english-words/",
    ESSENTIAL_DATA: "../../assets/data/4000-enssential-english-words/",
    SENTENCES: "../assets/data/sentences/"
}

const CARD_STATUS = {
    NEW: 0,
    LEARNING: 1,
    MEMORIZED: 2,
}

const CARD_RATING = {
    AGAIN: 0,
    HARD: 1,
    GOOD: 2,
    EASY: 3
}

const RATING_TIME = {
    AGAIN: 10,
    HARD: 30,
    GOOD: 60,
    EASY: 1440
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

const SCORE_RANGE = {
    MIN: 60,
    MAX: 75
}

const SCORE_RESULT_COLOR = {
    NORMAL: "E6E6E6",
    BAD: "#F53D36",
    GOOD: "#FFBD0D",
    EXCELLENT: "#43D217"
}

const TONE_TYPE = {
    FALL: "fall",
    FALLING: "falling",
    RISING: "rising",
}

const PHONEME_ERROR_TYPE = {
    DELETION: "Deletion",
    INSERTION: "Insertion",
    SUBSTITUTION: "Substitution"
}

const ORDINAL_NUMBER_SUFFIXES = {
    ST: "st",
    ND: "nd",
    RD: "rd",
    TH: "th",
}

const MESSAGE_RESOURCE = {
    RECORD_TIMEOUT: "Recording timeout, please try again!",
    RECORD_ERROR: "Recording error, please try again!",
    QUIZ_COMPLETED: "Quiz completed!"
}

const STORAGE_KEY = {
    STUDY_CARD: 'study-card',
    USER_INFO: "userInfo"
}

const CONFIG = {
    NUM_OF_LEARN_ON_DAY: 40,
    API_URL: "https://script.google.com/macros/s/AKfycbyuUI4PYwduiGnIlP8uiflCPhbg6Yiph7bmyJBBNsmJv_fyR3o3uDuivuUtSClsyYQOnw/exec"
}

const PARAM = {
    ACTION: "action",
    TABLE: "table",
    ID: "id",
    DATA: "data",
    USERNAME: "username",
    PASSWORD: "password",
    USER_ID: "userId"
}

const ACTION = {
    CREATE: "create",
    UPDATE: "update",
    READ: "read",
    DELETE: "delete",
    LOGIN: "login",
    REGISTER: "register",
    CHANGE_PASSWORD: "changePass",
    RATE: "rate",
    STUDY: "study"
}

const TABLE = {
    BOOK: "book",
    WORD: "word",
    UNIT: "unit",
    STORY: "story",
    USER: "user",
    USER_WORD: "userWord",
    TOPIC: "topic",
    SENTENCE: "sentence",
    VOCABULARY: "vocabulary"
}