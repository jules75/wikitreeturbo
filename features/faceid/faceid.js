
/*
 * See people's names when hovering over group photos.
 * Name/position data is stored in comments on page.
 * See https://www.wikitree.com/photo/jpg/Lacey-1616 for an example.
 */


const pageProfiles = getProfiles();
let faceData;


// create tooltip
$('body').append($('<div id="tooltip">'));


// true if numbers are nearly equal
function nearly(n, m) {
    const delta = 5;
    return Math.abs(n - m) < delta;
}


// return all profile data found in current page
function getProfiles() {
    const sel = '[itemtype="https://schema.org/Person"] a';
    return _.map($(sel), function (el) {
        return {
            target: el,
            href: el.href,
            name: el.innerText,
            profile: el.href.match(/\w+\-\d+.*$/)[0]
        };
    });
}


// returns true if element's text is valid WTT encoded JSON
function isWikiTreeTurboJSON(element) {
    try {
        const o = JSON.parse(element.innerText);
        return o.hasOwnProperty('wikiTreeTurbo');
    }
    catch (err) {
        return false;
    }
}


// returns all comments in current page that contain WTT JSON
function getWikiTreeTurboComments() {
    const divs = $('[itemprop="commentText"]');
    return _.filter(_.toArray(divs), isWikiTreeTurboJSON);
}


// returns face data if found in comments on page
// first comment block found is returned
// returns null if nothing found
function getFaceData() {

    const divs = getWikiTreeTurboComments();

    try {
        return JSON.parse(divs[0].innerText).wikiTreeTurbo.faceId;
    }
    catch (err) {
        // console.error(err);
        console.log("WTT: no comments found containing valid faceId JSON data");
        return null;
    }
}


function onMouseMove(e) {

    const x = e.originalEvent.offsetX / e.target.width * 100;
    const y = e.originalEvent.offsetY / e.target.height * 100;

    function match(o) {
        return nearly(o.x, x) && nearly(o.y, y);
    }

    const faceItem = _.find(faceData, match);
    if (faceItem) {

        function f(item) {
            return item.profile==faceItem.p;
        }

        const profile = _.find(pageProfiles, f);

        $(profile.target).addClass('highlight');

        $('#tooltip').show();
        $('#tooltip').text(profile.name);
        $('#tooltip').css('left', (e.clientX + 20) + 'px');
        $('#tooltip').css('top', (e.clientY + 20) + 'px');
    }
    else {
        $('#tooltip').hide();
        _.map(pageProfiles, function(p) { $(p.target).removeClass('highlight')});
    }
}


function init() {

    _.map(getWikiTreeTurboComments(), function(i) { $(i).addClass('containsJSON'); });

    if (getFaceData()) {
        faceData = getFaceData();
        $("img[itemprop='image']").on('mousemove', onMouseMove);
    }
}


init();

