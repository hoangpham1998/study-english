const unitText = document.getElementById('unit');
const container = document.getElementById('container');
const pagination = document.getElementById('pagination');
const totalUnit = 30;

const url = new URL(window.location.href);
const book = url.searchParams.get("book");
const unit = url.searchParams.get("unit");
const pathname = url.pathname;
const jsonPath = PATH.ESSENTIAL;
const imgSrc = `${jsonPath}files/Book-${book}/Image/`;
const audioSrc = `${jsonPath}files/Book-${book}/Audio/`;

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
            ? `<a class="skip-button" href="#" class="disabled">&laquo;</a>`
            : `<a class="skip-button" href="${pathname}?book=${book}&unit=${1}">&laquo;</a>`;
    
        // Previous page link
        paginationHTML += isFirst
            ? `<a class="skip-button" href="#" class="disabled">&#8249;</a>`
            : `<a class="skip-button" href="${pathname}?book=${book}&unit=${unitInt - 1}">&#8249;</a>`;
    
        // Page number links
        for (var i = startPage; i <= endPage; i++) {
            paginationHTML += i == unitInt
                ? `<a href="${pathname}?book=${book}&unit=${i}" class="active">${i}</a>`
                : `<a href="${pathname}?book=${book}&unit=${i}">${i}</a>`;
        }
    
        // Next page link
        paginationHTML += isLast
            ? `<a class="skip-button" href="#" class="disabled">&#8250;</a>`
            : `<a class="skip-button" href="${pathname}?book=${book}&unit=${(unitInt + 1)}">&#8250;</a>`;

        // Last page links
        paginationHTML += isLast
        ? `<a class="skip-button" href="#" class="disabled">&raquo;</a>`
        : `<a class="skip-button" href="${pathname}?book=${book}&unit=${totalUnit}">&raquo;</a>`;
    
        // Set the HTML for pagination container
        pagination.innerHTML = paginationHTML;
    }
}

const fetchJson = async (path) => {
    const response = await fetch(`${path}.json`);
    return await response.json();
};

const getDataBook = async (isRandom = false) => {
    var data = await fetchJson(`${jsonPath}books/book-${book}`);
    return isRandom 
        ? shuffleData(data[unit - 1])
        : data[unit - 1];
}

const shuffleData = (data) => {
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    return data;
}

const getPartOfSpeech = (value) => {
    // for (const key in PART_OF_SPEECH) {
    //     if (PART_OF_SPEECH[key] === value) {
    //         return key.toLowerCase();
    //     }
    // }
    // return null;
    return `(${value.replace('.', '')})`;
}


const getOrdinalNumberSuffixes = (number) => {
    if (number > 3 && number < 21)
        return `${number}${ORDINAL_NUMBER_SUFFIXES.TH}`;
    switch (number % 10) {
        case 1:
            return `${number}${ORDINAL_NUMBER_SUFFIXES.ST}`;
        case 2:
            return `${number}${ORDINAL_NUMBER_SUFFIXES.ND}`;
        case 3:
            return `${number}${ORDINAL_NUMBER_SUFFIXES.RD}`;
        default: 
            return `${number}${ORDINAL_NUMBER_SUFFIXES.TH}`;
    }
};

const closePage = () => {
    location.href = `unit.html?book=${book}&unit=${unit}`;
}

const hidePopup = () => {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.getElementsByClassName("container")[0].style.opacity = "unset";
}