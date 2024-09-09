const fetchData = async () => {
    const data = await fetchJson(`${essentialDataPath}book-list`);
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
            bookContent.innerHTML += `
                <a href="unit.html?book=${num}&unit=${x.id}">
                    <span style="font-weight: bold">${x.unit}: </span>${x.name}
                </a><br />
            `;
        });

        bookContent.innerHTML += `
            <a href="vocabularies.html?book=${num}">
                <span style="font-weight: bold">Vocabularies</span>
            </a><br />
            <a style="cursor: pointer;" onclick='syncData(${num})'>
                <span style="font-weight: bold">Sync data</span>
            </a><br />
            <a style="cursor: pointer;" onclick='downloadData(${num})'>
                <span style="font-weight: bold">Download data</span>
            </a>
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

const downloadData = async (num) => {
    const data = await fetchJson(`${essentialDataPath}books/book-${num}`);
    const prefix = `flashcards_${num}_`;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            const unit = key.slice(prefix.length);
            const index = parseInt(unit, 10) - 1;

            const srcDatas = data[index];
            if (!srcDatas) continue;

            const localData = JSON.parse(localStorage.getItem(key));
            mapData(localData, srcDatas);
        }
    }

    const jsonData = JSON.stringify(data, null, 2);
    if (jsonData) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `book-${num}.json`;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

const syncData = async (num) => {
    const data = await fetchJson(`${essentialDataPath}books/book-${num}`);
    const prefix = `flashcards_${num}_`;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            const unit = key.slice(prefix.length);
            const index = parseInt(unit, 10) - 1;

            const srcDatas = data[index];
            if (!srcDatas) continue;

            const localData = JSON.parse(localStorage.getItem(key));
            mapData(srcDatas, localData);

            localStorage.setItem(key, JSON.stringify(localData));
        }
    }
}

const mapData = (srcData, desData) => {
    const srcDataMap = new Map(srcData.map(item => [item.image, item]));
    desData.forEach(item => {
        const srcItem = srcDataMap.get(item.image);
        if (srcItem) {
            item.vi = item.vi !== srcItem.vi ? srcItem.vi : item.vi;
        }
    });
}

const backToHomePage = () => {
    location.href = '../../';
}