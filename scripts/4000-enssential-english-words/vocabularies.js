document.title = `Book ${book}`;

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
};

const fetchData = async () => {
    document.getElementById('book').textContent = `Book ${book}`;
    const data = await fetchJson(`${essentialDataPath}vocabularies/index-${book}`);
    container.innerHTML = data.map(createBookItem).join('');

    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', handleCollapsibleClick);
    });

    let total = 0;
    let items = [];
    document.querySelectorAll(".index-block-item li").forEach(item => {
        total++;
        var text = item.firstChild.data.trim();
        item.innerHTML = `<i class="fa fa-volume-up" style="margin-left: 2px;" onclick="speechWord(event, '${text}')"></i> ${item.innerHTML}`;
        item.addEventListener('click', handleIndexBlockItemClick);
        items.push(`${text}.mp3`);
    });
    console.log(items.join('\n'));

    // await items.forEach(async x => {
    //     await download(`${TEXT_TO_SPEECH.WORD_URL}-US/${x}`, x);
    // })

    // console.log("total: ", total);
    // console.log("isSuccess: ", isSuccess);
    // console.log("isFailed: ", isFailed);
    // console.log("failedItem: ", failedItem);
};

let isSuccess = 0;
let isFailed = 0;
let failedItem = [];
const download = async (fileUrl, fileName) => {
    try {
        const response = await fetch(fileUrl);

        // Check if the response is ok
        if (!response.ok) {
            isFailed++;
            failedItem.push(fileName);
            throw new Error(`Network response was not ok for file: ${fileUrl}`);
        }
        isSuccess++;
        const blob = await response.blob();

        // Create a new URL for the Blob object
        const url = URL.createObjectURL(blob);

        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Provide a default file name
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

const speechWord = async (event, text) => {
    event.stopPropagation();
    speechText(text);
}

const backToList = () => {
    location.href = `flashcard-list.html?book=${book}`;
}

fetchData();