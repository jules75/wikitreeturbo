/*
 * Let user build own faceId data by clicking profile names and faces on photo.
 */


var faceIdData = [];    // built up as user selects names/faces
var state = { isEditing: false };
var profile, name, x, y;
var elements = { tagButton: null, profileMessage: null, photoMessage: null, resultCode: null };


function resetState() {
    profile = name = "";
    x = y = -1;
}


function update() {
    updateState();
    updateUI();
}


function wrap(data) {
    return JSON.stringify({wikiTreeTurbo: {faceId: data}});
}


function updateUI() {

    $(elements.profileMessage).addClass('hidden');
    $(elements.photoMessage).addClass('hidden');

    if (state.isEditing) {
        if (profile == "") {
            $(elements.profileMessage).removeClass('hidden');
        }
        else if (x < 0 && y < 0) {
            $(elements.photoMessage).removeClass('hidden');
            $(elements.photoMessage).children('span').eq(0).text(name);
        }
    }
    else {
        if (faceIdData.length > 0) {
            $(elements.resultCode).show();
        }
    }

    $(elements.tagButton).text(state.isEditing ? "Done tagging" : "Tag people in this photo");
    $(elements.resultCode).children('pre').eq(0).text(wrap(faceIdData));

    const s = wrap(faceIdData);
    if (s.length > 800) {
        alert("ERROR: CANNOT CONTINUE. Too much face data for wikitree.com to store.");
        $(elements.tagButton).hide();
    }
}


function updateState() {
    if (profile != "" && x >= 0 && y >= 0) {
        faceIdData.push({ 'x': x, 'y': y, 'p': profile });
        resetState();
    }
}


function onProfileClick(e) {
    
    if (profile=="") {
        $(e.target).addClass('clicked');
    }

    name = e.target.innerText;
    profile = e.target.href.match(/\w+\-\d+.*$/)[0];
    update();
    e.preventDefault();
}


function onImageClick(e) {
    x1 = e.originalEvent.offsetX / e.target.width * 100;
    y1 = e.originalEvent.offsetY / e.target.height * 100;
    x = Number(x1.toFixed(2));
    y = Number(y1.toFixed(2));
    update();
    e.preventDefault();
}


function destroyListeners() {

}


function toggleEditing(e) {
    state.isEditing = !state.isEditing;

    if (state.isEditing) {
        createListeners();
    }
    else {

    }
    resetState();
    update();
}


function createListeners() {
    $('[itemtype="https://schema.org/Person"] a').click(onProfileClick);
    $("img[itemprop='image']").click(onImageClick);
}


function createUIComponents() {

    elements.tagButton = $("<button class='simple'></button>");
    $("img[itemprop='image']").parent().parent().prepend(elements.tagButton);

    elements.profileMessage = $("<li class='pulse'>Select the person below you want to tag</li>");
    $('ul.STYLED').first().prepend(elements.profileMessage);

    elements.photoMessage = $("<p class='pulse'>Select <span>person</span>'s face in the photo</p>");
    $("img[itemprop='image']").parent().parent().prepend(elements.photoMessage);

    elements.resultCode = $(`
        <div id="result">
        <div>
        <p>To complete the process:</p>
        <ol>
        <li>Copy the block of code on the right</li>
        <li>Paste it into the 'Add comment' box on this page and submit</li>
        <li>Refresh the page</li>
        </ol>
        </div>
        <pre></pre>
    `);
    $(elements.resultCode).hide();
    $('body').append(elements.resultCode);

}


createUIComponents();
$(elements.tagButton).click(toggleEditing);
update();
