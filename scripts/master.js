const unitText = document.getElementById('unit');
const container = document.getElementById('container');
const pagination = document.getElementById('pagination');
const totalUnit = 30;

const url = new URL(window.location.href);
const book = url.searchParams.get("book");
const unit = url.searchParams.get("unit");
const pathname = url.pathname;
const essentialDataRoute = `../${PATH.ESSENTIAL_ROUTE}`;
const essentialDataPath = PATH.ESSENTIAL_DATA;
const imgSrc = `${essentialDataPath}files/Book-${book}/Image/`;
const audioSrc = `${essentialDataPath}files/Book-${book}/Audio/`;

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

const getDataBook = async (isRandom = false) => {
    var data = await getWords(book, unit);
    return isRandom
        ? shuffleData(data)
        : data;
}

const shuffleData = (data) => {
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    return data;
}

const getKeyByValue = (obj, value) => {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return null;
}

const getPartOfSpeech = (value) => {
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

const isToday = (date) => {
    if (!date) {
        return false;
    }
    const dateCheck = new Date(date);
    const today = new Date();
    return (dateCheck.getFullYear() === today.getFullYear()
        && dateCheck.getMonth() === today.getMonth()
        && dateCheck.getDate() === today.getDate());
}

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

const notify = (message) => {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('notify-content').textContent = message;
    document.getElementsByClassName("container")[0].style.opacity = ".4";
}

const closePage = () => {
    location.href = `unit.html?book=${book}&unit=${unit}`;
}

const hidePopup = () => {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.getElementsByClassName("container")[0].style.opacity = "unset";
}

const backToHome = () => {
    location.href = '../';
}