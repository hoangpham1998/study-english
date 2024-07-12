document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('story-container');
    const popup = document.getElementById('tooltip-popup');
    const content = document.getElementById('tooltip-content');
    let dicts = [];

    const url = new URL(window.location.href);
    const book = url.searchParams.get("book");
    const unit = url.searchParams.get("unit");
    const src = `https://www.essentialenglish.review/apps-data/4000-essential-english-words-${book}/data/unit-${unit}/reading/`;

    const fetchJson = async (path) => {
        const response = await fetch(path);
        return await response.json();
    };

    const updatePopupPosition = (element) => {
        const rect = element.getBoundingClientRect();
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.top = `${rect.bottom + window.scrollY + 2}px`;
    };

    const displayPopup = (index) => {
        const dict = dicts[index];
        content.innerHTML = `${dict.vi} <br /><span class="desc">(${dict.desc})</span>`;
        popup.style.display = 'block';
    };

    const handleTooltipClick = (event) => {
        event.stopPropagation();
        const index = event.currentTarget.getAttribute('idx');
        displayPopup(index);
        updatePopupPosition(event.currentTarget);
    };

    const handleClickOutsidePopup = (event) => {
        if (!popup.contains(event.target) && !event.target.classList.contains('tooltip')) {
            popup.style.display = 'none';
        }
    };

    const initializeStory = async () => {
        const dictsData = await fetchJson(`assets/data/4000-enssential-english-words/books/book-${book}.json`);
        dicts = dictsData[unit - 1];

        const storiesData = await fetchJson(`assets/data/4000-enssential-english-words/stories/stories-${book}.json`);
        const story = storiesData[unit - 1][0];

        container.innerHTML = `
            <img class="story-img" src="${src}${story.image}" title="${story.en}" />
            <h3 class="story-title">${story.en.toUpperCase()}</h3>
            <audio controls>
                <source src="${src}${story.sound}" type="audio/mp3">
            </audio>
            <div class="story-content">
                <h3>${story.story}</h3>
            </div>
        `;

        document.querySelectorAll('.idiom-tip').forEach(tooltip => {
            tooltip.addEventListener('click', handleTooltipClick);
        });
    };

    document.addEventListener('click', handleClickOutsidePopup);
    initializeStory();
});