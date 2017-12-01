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


// temporary function to build profile object from watchlist page
function scrapeProfileData() {

    function rf(result, value, key) {
        const profile = value.href.match(/wiki\/(.*)$/)[1];
        result[profile] = { 'name': value.innerText, 'url': value.href };
        return result;
    }

    const links = $('table tr td:first-child a:first-child');
    return _.reduce(links, rf, {});
}


// localStorage.setItem('wikitreeturbo_watchlist', JSON.stringify(scrapeProfileData()));

createSearchPanel();

$('#searchPanel input').on('input', onInputChange);

$('body').keypress(onKeyPress);