//#region Authen
const changePassword = async (username, password) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.CHANGE_PASSWORD);
    params.append(PARAM.TABLE, TABLE.USER);
    params.append(PARAM.USERNAME, encodeURIComponent(username));
    params.append(PARAM.PASSWORD, encodeURIComponent(password));

    var result = await sendRequest(params);
    return result.status;
}

const register = async (username, password) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.REGISTER);
    params.append(PARAM.TABLE, TABLE.USER);
    params.append(PARAM.USERNAME, encodeURIComponent(username));
    params.append(PARAM.PASSWORD, encodeURIComponent(password));

    var result = await sendRequest(params);
    if (result.status === true) {
        localStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(result.userInfo));
        return true;
    }

    return false;
}

const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.LOGIN);
    params.append(PARAM.TABLE, TABLE.USER);
    params.append(PARAM.USERNAME, encodeURIComponent(username));
    params.append(PARAM.PASSWORD, encodeURIComponent(password));

    var result = await sendRequest(params);
    if (result.status === true) {
        localStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(result.userInfo));
        return true;
    }

    return false;
}

const logout = async () => {
    const userInfo = localStorage.getItem(STORAGE_KEY.USER_INFO);
    if (userInfo) {
        localStorage.removeItem(STORAGE_KEY.USER_INFO);
    }
    location.href = 'login.html';
}
//#endregion

//#region Sentence
const getTopics = async () => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.TOPIC);

    return await sendRequest(params);
}

const createTopic = async (request) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.CREATE);
    params.append(PARAM.TABLE, TABLE.TOPIC);
    params.append(PARAM.DATA, encodeURIComponent(request));

    return await sendRequest(params);
}

const getSentences = async () => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.SENTENCE);

    return await sendRequest(params);
}

const createSentence = async (request) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.CREATE);
    params.append(PARAM.TABLE, TABLE.SENTENCE);
    params.append(PARAM.DATA, encodeURIComponent(request));

    return await sendRequest(params);
}

const updateSentence = async (request) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.UPDATE);
    params.append(PARAM.TABLE, TABLE.SENTENCE);
    params.append(PARAM.DATA, encodeURIComponent(request));

    return await sendRequest(params);
}
//#endregion

//#region 4000 EEW
const getBooks = async () => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.BOOK);

    return await sendRequest(params);
}

const getUnits = async () => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.UNIT);

    return await sendRequest(params);
}

const getWords = async (bookId = null, unitId = null) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.WORD);

    if (bookId) {
        params.append('bookId', bookId);
    }

    if (unitId) {
        params.append('unitId', unitId);
    }

    return await sendRequest(params);
}

const getStories = async (bookId = null, unitId = null) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.STORY);

    if (bookId) {
        params.append('bookId', bookId);
    }

    if (unitId) {
        params.append('unitId', unitId);
    }

    return await sendRequest(params);
}

const getVocabularies = async (bookId) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.READ);
    params.append(PARAM.TABLE, TABLE.VOCABULARY);
    params.append('bookId', bookId);

    return await sendRequest(params);
}

const updateWord = async (request) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.UPDATE);
    params.append(PARAM.TABLE, TABLE.SENTENCE);
    params.append(PARAM.DATA, encodeURIComponent(request));

    return await sendRequest(params);
}

const getStudyCard = async (userId) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.STUDY);
    params.append(PARAM.TABLE, TABLE.USER_WORD);
    params.append(PARAM.USER_ID, userId);

    return await sendRequest(params);
}

const rateWord = async (request) => {
    const params = new URLSearchParams();
    params.append(PARAM.ACTION, ACTION.RATE);
    params.append(PARAM.TABLE, TABLE.USER_WORD);
    params.append(PARAM.DATA, encodeURIComponent(request));

    return await sendRequest(params);
}
//#endregion

//#region Utils
const sendRequest = async (params) => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "text/plain;charset=utf-8",
    };

    let response = await fetch(`${CONFIG.API_URL}?${params.toString()}`, {
        method: "GET",
        headers: headersList
    });
    
    return await response.json();
}
//#endregion