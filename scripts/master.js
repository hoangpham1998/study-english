const unitText = document.getElementById('unit');
const container = document.getElementById('container');
const pagination = document.getElementById('pagination');
const totalUnit = 30;

const url = new URL(window.location.href);
const book = url.searchParams.get("book");
const unit = url.searchParams.get("unit");
const pathname = url.pathname;
const src = `https://www.essentialenglish.review/apps-data/4000-essential-english-words-${book}/data/unit-${unit}/`;
const jsonPath = `assets/data/4000-enssential-english-words/`;

if (unit) {
    var title = `Unit ${unit}`;
    document.title += title;
    
    if (unitText) {
        unitText.textContent = title;
    }

    if (pagination) {
        var unitInt = parseInt(unit, 10);
        var isFirst = unitInt == 1;
        var isLast = unitInt == totalUnit;

        // Determine the range of page numbers to display
        var startPage = Math.max(1, unitInt - 2);
        var endPage = Math.min(startPage + 3, totalUnit);
    
        // Create the pagination links
        var paginationHTML = '';

        // First page links
        paginationHTML += isFirst
            ? `<a href="#" class="disabled">&laquo;</a>`
            : `<a href="${pathname}?book=${book}&unit=${1}">&laquo;</a>`;
    
        // Previous page link
        paginationHTML += isFirst
            ? `<a href="#" class="disabled">&#8249;</a>`
            : `<a href="${pathname}?book=${book}&unit=${unitInt - 1}">&#8249;</a>`;
    
        // Page number links
        for (var i = startPage; i <= endPage; i++) {
            paginationHTML += i == unitInt
                ? `<a href="${pathname}?book=${book}&unit=${i}" class="active">${i}</a>`
                : `<a href="${pathname}?book=${book}&unit=${i}">${i}</a>`;
        }
    
        // Next page link
        paginationHTML += isLast
            ? `<a href="#" class="disabled">&#8250;</a>`
            : `<a href="${pathname}?book=${book}&unit=${(unitInt + 1)}">&#8250;</a>`;

        // Last page links
        paginationHTML += isLast
        ? `<a href="#" class="disabled">&raquo;</a>`
        : `<a href="${pathname}?book=${book}&unit=${totalUnit}">&raquo;</a>`;
    
        // Set the HTML for pagination container
        pagination.innerHTML = paginationHTML;
    }
}

const fetchJson = async (path) => {
    const response = await fetch(`${path}.json`);
    return await response.json();
};

const shuffleData = (data) => {
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    return data;
}

const closePage = () => {
    location.href = `unit.html?book=${book}&unit=${unit}`;
}

const hidePopup = () => {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.getElementsByClassName("container")[0].style.opacity = "unset";
}