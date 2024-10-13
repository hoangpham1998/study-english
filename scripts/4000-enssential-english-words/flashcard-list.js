const fetchData = async () => {
    let units = await getUnits();
    const bookIds = [...new Set(units.map(item => item.bookId))];
    for (const bookId of bookIds) {
        container.innerHTML += `
            <div class="book-item">
                <button type="button" class="collapsible" onclick="toggleBlock(this)">Book ${bookId}</button>
                <div class="content" id="book-${bookId}"></div>
            </div>
        `;

        var bookContent = document.getElementById(`book-${bookId}`);
        for (const unit of units) {
            if (unit.bookId !== bookId) {
                continue;
            }

            var unitId = unit.id;
            bookContent.innerHTML += `
                <a href="unit.html?book=${bookId}&unit=${unitId}">
                    <span style="font-weight: bold">Unit ${unit.unit}: </span>${unit.name}
                </a><br />
            `;
        };

        bookContent.innerHTML += `
            <a href="vocabularies.html?book=${bookId}">
                <span style="font-weight: bold">Vocabularies</span>
            </a>
        `;
    }
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

const backToHomePage = () => {
    location.href = '../../';
}