let readFile = () => {
    let e = $("#upload")[0].files[0],
    l = new FileReader();

    (l.onload = ((e) => (e) => {
        $("#input").removeAttr('disabled');
        $(".btn").removeAttr('disabled');

        var data = new Uint8Array(e.target.result);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) 
            arr[i] = String.fromCharCode(data[i]);

        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
            type: "binary"
        });

        // Get sheets
        let sheetTab = "";
        let content = "";
        workbook.SheetNames.forEach((sheet, index) => {
            let sheetId = sheet.replace(' ', '');
            let worksheet = workbook.Sheets[sheet];
            let dataObj = XLSX.utils.sheet_to_json(worksheet);
            let text = "";

            dataObj.forEach((element, rowIndex) => {
                let textId = `${sheetId}-${rowIndex}`;
                text += '<div class="row" style="margin-top: 15px;">\
                    <div class="col">\
                        <div class="flip-card" onclick="flip(\'' + textId + '\')">\
                            <div class="flip-card-inner sheet-' + sheetId + ' card-' + textId + '">\
                                <div class="flip-card-front">' + element.english + '</div>\
                                <div class="flip-card-back">' + element.vietnamese + '</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>';
            });

            sheetTab += '<button class="nav-link ' + (index === 0 ? 'active' : '') + '" id="nav-'
                + sheetId + '-tab" data-sheet="' + sheetId + '" data-bs-toggle="tab" data-bs-target="#nav-'
                + sheetId + '"type="button" role="tab" aria-controls="nav-'
                + sheetId + '" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' + sheet + '</button>';

            content += '<div class="tab-pane fade ' + (index === 0 ? "show active" : '')
                + '" id="nav-' + sheetId + '" role="tabpanel" aria-labelledby="nav-'
                + sheetId + '-tab"><div id="table-' + sheetId + '">' + text + '</div></div>';
        });

        $("#nav-tab").html(sheetTab);
        $("#nav-tabContent").html(content);
    })()), l.readAsArrayBuffer(e);
};

let flip = (id) => {
    if ($(".card-" + id).hasClass("active")) {
        $(".card-" + id).removeClass("active");
    } else {
        $(".card-" + id).addClass("active");
    }
};

$("#upload").change(() => {
    readFile();
});

$("#show-all").click(() => {
    let id = $(".nav-link.active").data('sheet');
    $(".sheet-" + id).addClass("active");
});

$("#reset").click(() => {
    let id = $(".nav-link.active").data('sheet');
    $(".sheet-" + id).removeClass("active");
});