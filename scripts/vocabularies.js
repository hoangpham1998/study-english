const container = document.getElementById('vocabularies-container');

// Load flashcards from JSON file
var url = new URL(window.location.href);
var book = url.searchParams.get("book");

fetch(`assets\\data\\4000-enssential-english-words\\vocabularies\\index-${book}.json`)
    .then(response => response.json())
    .then(data => {
        data.forEach(x => {
            container.innerHTML += `<div class="book-item">
                <button class="collapsible" onclick="toggleBlock(this)">${x.en.toUpperCase()}</button>
                <div class="content">${x.story}</div>
            </div>`;
        });
        
        $(".index-block-item li").click(function() {
            var e = $(this).children(".tool-index-idioms").html();
            $(this).html('<div class="tool-index-idioms">' + e + "</div>");
            $(this).css({
                display: "table",
                width: "-webkit-fill-available",
                margin: "20px 0px 20px 0px"
            });
            $(this).children(".tool-index-idioms").attr("style", "display: table-cell;background:antiquewhite; padding:10px; border-radius:5px; color:black");
        });
    });

const toggleBlock = (event) => {
    event.classList.toggle("active");
    var content = event.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

