const container = document.getElementById('container');

const url = new URL(window.location.href);
const book = url.searchParams.get("book");
const unit = url.searchParams.get("unit");
const src = `https://www.essentialenglish.review/apps-data/4000-essential-english-words-${book}/data/unit-${unit}/`;
const jsonPath = `assets/data/4000-enssential-english-words/`;

const fetchJson = async (path) => {
    const response = await fetch(`${path}.json`);
    return await response.json();
};

const shuffleData = (data) => {
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    return data;
}