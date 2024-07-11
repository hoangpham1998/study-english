const coll = document.getElementsByClassName("collapsible");
const bookContainer = document.getElementById('book-container');

const fetchUnits = () => {
    fetch(`assets\\data\\4000-enssential-english-words\\book-list.json`)
        .then(response => response.json())
        .then(data => {
            data.forEach((book, index) => {
                var num = index + 1;
                bookContainer.innerHTML += `<div class="book-item">
                            <button type="button" class="collapsible" onclick="toggleBlock(this)">Book ${num}</button>
                            <div class="content" id="book-${num}"></div>
                        </div>`;

                var bookContent = document.getElementById(`book-${num}`);

                book.forEach(x => {
                    bookContent.innerHTML += `<a href="flashcard.html?book=${num}&unit=${x.unit.split(" ")[1]}">
                            <span style="font-weight: bold">${x.unit}: </span>${x.name}
                        </a><br />`;
                });

                bookContent.innerHTML += `<a href="vocabularies.html?book=${num}">
                        <span style="font-weight: bold">Vocabularies</span>
                    </a><br />`;
            });
        });
}

fetchUnits();

const toggleBlock = (event) => {
    event.classList.toggle("active");
    var content = event.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}