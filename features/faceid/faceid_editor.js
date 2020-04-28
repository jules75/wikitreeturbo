/*
 * Let user build own faceId data by clicking profile names and faces on photo.
 */


let state = { isEditing: false, faceIdObject: {} };
let profile, name, x, y;
let elements = { tagButton: null, profileMessage: null, photoMessage: null };


function resetUserSelection() {
    profile = name = "";
    x = y = -1;
}


function update() {
    updateState();
    updateUI();
}


function wrap(data) {
    return JSON.stringify({ wikiTreeTurbo: { faceId: data } });
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
        if (!_.isEmpty(state.faceIdObject)) {
            $(elements.tagButton).hide();
            $('button[id="postNewCommentButton"]').click()  // reveal textarea
            $('textarea').text(wrap(state.faceIdObject));   // populate textarea
            $('button[data-action="postSubmit"]').click();  // submit form
        }
    }

    $(elements.tagButton).text(state.isEditing ? "-- Done tagging, save --" : "Tag people in this photo");

    const s = wrap(state.faceIdObject);
    if (s.length > 800) {
        alert("ERROR: CANNOT CONTINUE. Too much face data for wikitree.com to store.");
        $(elements.tagButton).hide();
    }
}


function updateState() {
    if (profile != "" && x >= 0 && y >= 0) {
        state.faceIdObject[profile] = { 'x': x, 'y': y };
        resetUserSelection();
    }
}


function onProfileClick(e) {

    if (profile == "") {
        $(e.target).addClass('clicked');
    }

    name = e.target.innerText;
    profile = e.target.href.match(/\w+\-\d+.*$/)[0];    // TODO: this fails on last name with space
    update();
    e.preventDefault();
}


function onImageClick(e) {
    const x1 = e.originalEvent.offsetX / e.target.width * 100;
    const y1 = e.originalEvent.offsetY / e.target.height * 100;
    x = Number(x1.toFixed(2));
    y = Number(y1.toFixed(2));
    update();
    e.preventDefault();
}


function toggleEditing(e) {
    state.isEditing = !state.isEditing;

    if (state.isEditing) {
        createListeners();
    }
    resetUserSelection();
    update();
}


function createListeners() {
    $('span[itemtype="https://schema.org/Person"] a').click(onProfileClick);
    $("img[itemprop='image']").click(onImageClick);
}


function createUIComponents() {

    elements.tagButton = $("<button class='simple'></button>");
    $("img[itemprop='image']").parent().parent().prepend(elements.tagButton);

    elements.profileMessage = $("<li class='pulse'>Select the name of the person you want to tag below</li>");
    $('ul.STYLED').first().prepend(elements.profileMessage);

    elements.photoMessage = $("<p class='pulse'>Select <span>person</span>'s face in the photo</p>");
    $("img[itemprop='image']").parent().parent().prepend(elements.photoMessage);

}


createUIComponents();
$(elements.tagButton).click(toggleEditing);
update();
