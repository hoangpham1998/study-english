const generateAudio = async (text, isVi) => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8"
    };

    const body = {
        audioFormat: "mp3",
        paragraphChunks: [text],
        voiceParams: isVi 
            ? TEXT_TO_SPEECH.VI_OPTION
            : TEXT_TO_SPEECH.EN_OPTION
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

const speechCard = (event, id) => {
    event.stopPropagation();
    let audio = document.getElementById(id);
    audio.play();
}

const speech = async (event, text, isVi = false) => {
    event.stopPropagation();

    const audio = new Audio();
    audio.src = await generateAudio(text.replace(/<\/?[^>]+>/gi, ''), isVi);
    audio.play();
}