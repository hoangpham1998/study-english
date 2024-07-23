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

const fetchData = async () => {
    document.getElementById('book').textContent = book;
    const data = await fetchJson(`${jsonPath}vocabularies/index-${book}`);
    container.innerHTML = data.map(createBookItem).join('');

    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', handleCollapsibleClick);
    });

    document.querySelectorAll(".index-block-item li").forEach(item => {
        item.addEventListener('click', handleIndexBlockItemClick);
    });
};

fetchData();