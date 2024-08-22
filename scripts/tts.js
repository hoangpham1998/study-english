const speechifyUrl = "https://audio.api.speechify.com/generateAudioFiles";
const generateAudio = async (text, isVi) => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8"
    };

    var voiceParams = isVi ? {
        engine: "azure",
        languageCode: "vi-VN",
        name: "hoaimy"
    } : {
        name: "snoop",
        engine: "resemble",
        languageCode: "en-US"
    }

    const body = {
        audioFormat: "mp3",
        paragraphChunks: [text],
        voiceParams: voiceParams
    };

    try {
        const response = await fetch(speechifyUrl, {
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