const container = document.getElementById('story-container');
const popup = document.getElementById('tooltip-popup');
const content = document.getElementById('tooltip-content');
const closeBtn = document.getElementById('close-btn');

let dicts = [];

var url = new URL(window.location.href);
var book = url.searchParams.get("book");
var unit = url.searchParams.get("unit");

const src = `https://www.essentialenglish.review/apps-data/4000-essential-english-words-${book}/data/unit-${unit}/reading/`;

fetch(`assets\\data\\4000-enssential-english-words\\books\\book-${book}.json`)
    .then(response => response.json())
    .then(data => {
        dicts = data[unit - 1];
    });

fetch(`assets\\data\\4000-enssential-english-words\\stories\\stories-${book}.json`)
    .then(response => response.json())
    .then(data => {
        var story = data[unit - 1][0];
        container.innerHTML = `
            <img class="story-img" src='${src}${story.image}' title="${story.en}" />
            <h3 class="story-title">${story.en.toUpperCase()}</h3>
            <audio controls>
                <source src="${src}${story.sound}" type="audio/mp3">
            </audio>
            <div class="story-content">
                <h3>${story.story}</h3>
            </div>
        `;
        
        const idiomTips = Array.from(document.querySelectorAll('.idiom-tip'));
        idiomTips.forEach(tooltip => {
            tooltip.addEventListener('click', function(e) {
                e.stopPropagation(); 

                var idx = e.srcElement.getAttribute('idx');
                var dict = dicts[idx];
                content.innerHTML = `${dict.vi} <br /><span class="desc">(${dict.desc})<span>`;

                // Get the position of the tooltip
                const rect = this.getBoundingClientRect();
                
                // Position the popup
                popup.style.left = `${rect.left + window.scrollX}px`;
                popup.style.top = `${rect.bottom + window.scrollY + 2}px`;

                popup.style.display = 'block';
            });
        });
    
        // Close the popup if clicking outside of it
        document.addEventListener('click', function(e) {
            if (!popup.contains(e.target) && !e.target.classList.contains('tooltip')) {
                popup.style.display = 'none';
            }
        });
    });