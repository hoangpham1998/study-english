const generateAudio = async (text, isVi) => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8"
    };

    const body = {
        audioFormat: "mp3",
        paragraphChunks: [text],
        voiceParams: isVi
            ? TEXT_TO_SPEECH.VI_OPTION
            : TEXT_TO_SPEECH.EN_US_OPTION
    };

    try {
        const response = await fetch(TEXT_TO_SPEECH.BASE_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`[generateAudio] HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const audioStream = data.audioStream;
        return `data:audio/mp3;base64,${audioStream}`;
    } catch (error) {
        console.error("[generateAudio] Error fetching data:", error);
    }
};

const speechText = async (text, isEn = true) => {
    let source = `${TEXT_TO_SPEECH.WORD_URL}${isEn ? COUNTRY_CODE.US : COUNTRY_CODE.GB}/${text}.mp3`;
    const response = await fetch(source);
    if (!response.ok) {
        source = await generateAudio(text, false);
    }
    const audio = new Audio();
    audio.src = source;
    audio.play();
}