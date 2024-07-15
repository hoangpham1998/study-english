const fetchData = async () => {
    const data = await fetchJson(`${jsonPath}book-list`);
    data.forEach((book, index) => {
        var num = index + 1;
        container.innerHTML += `
            <div class="book-item">
                <button type="button" class="collapsible" onclick="toggleBlock(this)">Book ${num}</button>
                <div class="content" id="book-${num}"></div>
            </div>
        `;

        var bookContent = document.getElementById(`book-${num}`);

        book.forEach(x => {
            var unit = x.unit.split(" ")[1];
            bookContent.innerHTML += `
                <a href="flashcard.html?book=${num}&unit=${unit}">
                    <span style="font-weight: bold">${x.unit}: </span>${x.name}
                </a>
                <span class="hyphen">-</span>
                <a href="quiz.html?book=${num}&unit=${unit}" style="text-decoration: underline;">Quiz</a>
                <span class="hyphen">-</span>
                <a href="story.html?book=${num}&unit=${unit}" style="text-decoration: underline;">Story</a><br />
            `;
        });

        bookContent.innerHTML += `
            <a href="vocabularies.html?book=${num}">
                <span style="font-weight: bold">Vocabularies</span>
            </a><br />
        `;
    });
}

fetchData();

const toggleBlock = (event) => {
    event.classList.toggle("active");
    var content = event.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}