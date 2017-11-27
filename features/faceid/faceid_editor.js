/*
 * Let user build own faceId data by clicking profile names and faces on photo.
 */


var faceIdData = [];    // built up as user selects names/faces
var state = {isEditing: false};
var profile, name, x, y;
var elements = {profileMessage: null, photoMessage: null};


function resetState() {
    profile = name = "";
    x = y = -1;
}


function update() {
    updateState();
    updateUI();
}


function updateUI() {
    
    console.log(faceIdData);

    $(elements.profileMessage).hide();
    $(elements.photoMessage).hide();

    if (profile == "") {
        $(elements.profileMessage).show();
    }
    else if (x<0 && y<0) {
        $(elements.photoMessage).show();
    }
}


function updateState() {
    if (profile != "" && x>=0 && y>=0) {
        faceIdData.push({'x': x, 'y': y, 'p': profile});
        resetState();
    }
}


function onProfileClick(e) {
    name = e.target.innerText;
    profile = e.target.href.match(/\w+\-\d+.*$/)[0];
    update();
    e.preventDefault();
}


function onImageClick(e) {
    x = e.originalEvent.offsetX / e.target.width * 100;
    y = e.originalEvent.offsetY / e.target.height * 100;
    update();
    e.preventDefault();
}


function createListeners() {
    $('[itemtype="https://schema.org/Person"] a').click(onProfileClick);
    $("img[itemprop='image']").click(onImageClick);
}


function destroyListeners() {

}


function initEditor() {

    createListeners();
    
    elements.profileMessage = $("<li class='pulse hidden'>Select the person below you want to tag</li>");
    $('ul.STYLED').first().prepend(elements.profileMessage);

    elements.photoMessage = $("<p class='pulse hidden'>Select their face in the photo</p>");
    $("img[itemprop='image']").parent().parent().prepend(elements.photoMessage);

    resetState();
    update();
}


function toggleEditing(e) {
    state.isEditing = !state.isEditing;
    console.log("editing=", state.isEditing);
    initEditor();
    update();
}


function createEditorButton() {
    const btn = $("<button class='simple'>Tag people in this photo</button>");
    $(btn).click(toggleEditing);
    $("img[itemprop='image']").parent().parent().prepend(btn);
}


createEditorButton();