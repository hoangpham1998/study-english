document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('vocabularies-container');

    const url = new URL(window.location.href);
    const book = url.searchParams.get("book");
    const dataUrl = `assets/data/4000-enssential-english-words/vocabularies/index-${book}.json`;

    const fetchJson = async (path) => {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    };

    const createBookItem = ({ en, story }) => `
        <div class="book-item">
            <button class="collapsible">${en.toUpperCase()}</button>
            <div class="content">${story}</div>
        </div>
    `;

    const handleCollapsibleClick = (event) => {
        const button = event.currentTarget;
        button.classList.toggle("active");
        const content = button.nextElementSibling;
        content.style.display = (content.style.display === "block") ? "none" : "block";
    };

    const handleIndexBlockItemClick = (event) => {
        const listItem = event.currentTarget;
        const toolIndexIdiomsHtml = listItem.querySelector(".tool-index-idioms").innerHTML;
        listItem.innerHTML = `<div class="tool-index-idioms">${toolIndexIdiomsHtml}</div>`;
        listItem.style.display = "table";
        listItem.style.width = "-webkit-fill-available";
        listItem.style.margin = "20px 0";
        
        const idioms = listItem.querySelector(".tool-index-idioms");
        idioms.style.display = "table-cell";
        idioms.style.background = "antiquewhite";
        idioms.style.padding = "10px";
        idioms.style.borderRadius = "5px";
        idioms.style.color = "black";
    };

    const initialize = async () => {
        try {
            const data = await fetchJson(dataUrl);
            container.innerHTML = data.map(createBookItem).join('');

            document.querySelectorAll('.collapsible').forEach(button => {
                button.addEventListener('click', handleCollapsibleClick);
            });

            document.querySelectorAll(".index-block-item li").forEach(item => {
                item.addEventListener('click', handleIndexBlockItemClick);
            });
        } catch (error) {
            console.error("Error loading vocabulary data:", error);
        }
    };

    initialize();
});