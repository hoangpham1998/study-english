const imgPath = `${imgSrc}story/`;
const audioPath = `${audioSrc}story/`;
const popup = document.getElementById('tooltip-popup');
const content = document.getElementById('tooltip-content');

let dicts = [];

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

const fetchData = async () => {
    dicts = await getWords(book, unit);

    const storiesData = await getStories(book, unit);
    storiesData.forEach(story => {
        container.innerHTML += `
            <img class="story-img" src="${imgPath}${story.image}" title="${story.image}" /><br/>
            <h3 class="story-title" id="en-title">UNIT ${unit}: ${story.enTitle.toUpperCase()}</h3>
            <audio controls>
                <source src="${audioPath}${story.sound}" type="audio/mp3">
            </audio>
            <div class="story-content" id="en-story">
                <h3>${story.en}</h3>
            </div>
            <hr/>
            <h3 class="story-title" id="vi-title">${story.viTitle.toUpperCase()}</h3>
            <div class="story-content" id="vi-story">
                <h3>${story.vi}</h3>
            </div>
        `;
    });
    
    document.querySelectorAll('.idiom-tip').forEach(tooltip => {
        tooltip.addEventListener('click', handleTooltipClick);
    });
};

document.addEventListener('click', handleClickOutsidePopup);
fetchData();