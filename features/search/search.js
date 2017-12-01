/*
 * Quick search your watchlist by pressing backquote (`) on your keyboard
 */


// let state = { searchPanelOpen: false };
// let elements = { searchPanel: null };


const profiles = JSON.parse(localStorage.getItem('wikitreeturbo_watchlist'));


function renderMatches(matchedProfiles) {
    
    function f(o) {
        let li = $(`<li><a href="${o.url}">${o.name}</a></li>`);
        $('#searchPanel ul').append(li);
    }

    $('#searchPanel ul li').remove();
    _.map(matchedProfiles, f);
}


function isMatch(s, o) {
    return _.includes(o.name.toLowerCase(), s.toLowerCase());
}


function onInputChange(e) {

    if (profiles == null) {
        alert('No watchlist data found. Please visit your watchlist page, then try again.');
        return;
    }

    const s = $('#searchPanel input').val();
    const f = _.partial(isMatch, s);
    renderMatches(_.pickBy(profiles, f));
}


function createSearchPanel() {
    let div = $(`
    <div id="searchPanel">
        <input type="text" placeholder="Start typing..." />
        <ul></ul>
    </div>
`);
    $('body').append(div);
}


function onKeyPress(e) {
    
    if (e.originalEvent.code !== 'Backquote') {
        return;
    }

    $('#searchPanel').toggle();
    $('#searchPanel input').focus();
    e.preventDefault();
}


createSearchPanel();

$('#searchPanel input').on('input', onInputChange);
$('body').keypress(onKeyPress);
