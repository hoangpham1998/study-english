document.title = `Book ${book}`;

const createBookItem = ({ letter, content }) => `
    <div class="book-item">
        <button class="collapsible">${letter.toUpperCase()}</button>
        <div class="content">${content}</div>
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
};

const fetchData = async () => {
    document.getElementById('book').textContent = `Book ${book}`;
    const data = await getVocabularies(book)
    container.innerHTML = data.map(createBookItem).join('');

    document.querySelectorAll('.index-block-item li').forEach(item => {
        item.addEventListener('click', handleIndexBlockItemClick);
    });

    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', handleCollapsibleClick);
    });
};

const speechWord = async (event, text) => {
    event.stopPropagation();
    speechText(text);
}

const backToList = () => {
    location.href = `flashcard-list.html?book=${book}`;
}

fetchData();