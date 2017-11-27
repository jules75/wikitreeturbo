/*
 * Let user build own faceId data by clicking profile names and faces on photo.
 */


// mutable state
var faceIdData = [];    // built up as user selects names/faces
var profile, name, x, y;


function resetState() {
    profile = name = "";
    x = y = -1;
}


function updateState() {
    
    $('#faceIdEditor pre').text(JSON.stringify(faceIdData));

    if (profile == "") {
        $('#faceIdEditor p').text("Select name of person you wish to tag in photo");
    }

    else if (x<0 && y<0) {
        $('#faceIdEditor p').text(`Select ${name}'s face in the photo`);
    }

    else {
        faceIdData.push({'x': x, 'y': y, 'p': profile});
        resetState();
        updateState();
    }

}

function onProfileClick(e) {
    name = e.target.innerText;
    profile = e.target.href.match(/\w+\-\d+.*$/)[0];
    updateState();
    e.preventDefault();
}


function onImageClick(e) {
    x = e.originalEvent.offsetX / e.target.width * 100;
    y = e.originalEvent.offsetY / e.target.height * 100;
    updateState();
    e.preventDefault();
}


function createEditorDiv() {
    const editorDiv = $('<div id="faceIdEditor"><p></p><pre></pre></div>');
    $('body').append(editorDiv);
}


function initEditor() {
    console.log("WTT: faceId editor enabled");
    $('[itemtype="https://schema.org/Person"] a').click(onProfileClick);
    $("img[itemprop='image']").click(onImageClick);
    createEditorDiv();    
    resetState();
    updateState();
}


// initEditor();

