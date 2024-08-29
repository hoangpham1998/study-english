let readFile = async () => {
    var topics = await fetchJson(`${PATH.SENTENCES}/topic`);
    if (!topics)
        return;
    
    var data = await fetchJson(`${PATH.SENTENCES}/sentences`);
    if (!data)
        return;

    $("#input").removeAttr('disabled');
    $(".btn").removeAttr('disabled');

    // Get sheets
    let topicTab = "";
    let content = "";
    topics.forEach((topic, index) => {
        let topicId = topic.id;
        let dataObj = data.filter(x => x.topicId == topicId);
        let text = "";

        dataObj.forEach(element => {
            let textId = `${topicId}-${element.id}`;
            text += `<div class="row" style="margin-top: 15px;">
                <div class="col">
                    <div class="flip-card" onclick="flip('${textId}')">
                        <div class="flip-card-inner sheet-${topicId} card-${textId}">
                            <div class="flip-card-front">
                                ${element.en}
                                <i class="fa fa-volume-up" style="margin-left: 2px;" onclick="speech(event, '${element.en}')"></i>
                            </div>
                            <div class="flip-card-back">${element.vi}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        topicTab += '<button class="nav-link ' + (index === 0 ? 'active' : '') + '" id="nav-'
            + topicId + '-tab" data-sheet="' + topicId + '" data-bs-toggle="tab" data-bs-target="#nav-'
            + topicId + '"type="button" role="tab" aria-controls="nav-'
            + topicId + '" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' + topic.name + '</button>';

        content += '<div class="tab-pane fade ' + (index === 0 ? "show active" : '')
            + '" id="nav-' + topicId + '" role="tabpanel" aria-labelledby="nav-'
            + topicId + '-tab"><div id="table-' + topicId + '">' + text + '</div></div>';
    });

    $("#nav-tab").html(topicTab);
    $("#nav-tabContent").html(content);
};

let flip = (id) => {
    if ($(".card-" + id).hasClass("active")) {
        $(".card-" + id).removeClass("active");
    } else {
        $(".card-" + id).addClass("active");
    }
};

$("#show-all").click(() => {
    let id = $(".nav-link.active").data('sheet');
    $(".sheet-" + id).addClass("active");
});

$("#reset").click(() => {
    let id = $(".nav-link.active").data('sheet');
    $(".sheet-" + id).removeClass("active");
});

readFile();