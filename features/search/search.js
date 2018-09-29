/*
 * Quick search your watchlist by pressing backquote (`) on your keyboard
 */


let searchState = {
    searchPanelActive: false,
    selectedResultIndex: 0,
    resultCount: 0,
    triggerSelection: false
};


const profiles = JSON.parse(localStorage.getItem('wikitreeturbo_watchlist'));


function updateUI() {

    if (_.isEmpty(profiles)) {
        $('#searchPanel div').show();
    }

    // show/hide panel
    if (searchState.searchPanelActive) {
        $('#searchPanel').slideDown(100);
        $('#searchPanel input').focus();
    } else {
        $('#searchPanel').slideUp(100);
    }

    // highlight a result
    $('#searchPanel ul li').removeClass('selected');
    $(`#searchPanel ul li:nth-child(${searchState.selectedResultIndex + 1})`).addClass('selected');

    // select result
    if (searchState.triggerSelection) {
        $(`#searchPanel ul li:nth-child(${searchState.selectedResultIndex + 1}) a`)[0].click();
    }

}


function renderMatches(matchedProfiles) {

    function f(o) {
        let li = $(`<li><a href="${o.url}">${o.name}<br><em>${o.born}</em></a></li>`);
        $('#searchPanel ul').append(li);
    }

    $('#searchPanel ul li').remove();
    _.map(matchedProfiles, f);
}


function isMatch(s, o) {
    return _.includes(o.name.toLowerCase(), s.toLowerCase());
}


function createSearchPanel() {
    
    let div = $(`
    <div id="searchPanel">
        <input type="text" placeholder="Start typing..." />
        <ul></ul>
        <div style="display:none;">Welcome to quick search!<br><br>
            To get it working, you must first 
            <a href="/index.php?title=Special:WatchedList">open your watchlist page</a>.<br><br>
            After you've done that, reload any WikiTree page, and quick search will work.<br><br>
            Any profile you visit that is NOT in your watchlist is also added to the quick search index.<br><br>
            Be sure to visit your watchlist page occasionally to keep quick search up to date.
            </div>
        <p>ARROW UP/DOWN to select<br>
        ENTER to open<br>
        ESC or BACKQUOTE (\`) to close</p>
    </div>
`);
    $('body').append(div);
}


function createSearchButton() {
    const html = `<button id="wttSearch">Quick search</button>`;
    $('body').prepend($(html));
}


function onInputChange(e) {

    searchState.selectedResultIndex = 0;

    const s = $('#searchPanel input').val();
    const f = _.partial(isMatch, s);
    const result = (s.length > 0) ? _.pickBy(profiles, f) : {};

    searchState.resultCount = _.size(result);
    renderMatches(result);
}


function onSearch() {
    searchState.searchPanelActive = !searchState.searchPanelActive;
    updateUI();
}


// separate fn to supress keypress
function onKeypress(e) {
    const backquote = '`';
    if (e.originalEvent.key == backquote && e.originalEvent.shiftKey == false) {
        onSearch();
        e.preventDefault();
    }
}


function onArrowOrEnter(e) {

    code = e.originalEvent.code;

    if (code == 'ArrowDown') {
        searchState.selectedResultIndex++;
    }
    else if (code == 'ArrowUp') {
        searchState.selectedResultIndex--;
    }
    else if (code == 'Enter') {
        searchState.triggerSelection = true;
    }
    else if (code == 'Escape') {
        searchState.searchPanelActive = false;
    }

    if (searchState.selectedResultIndex < 0) {
        searchState.selectedResultIndex = searchState.resultCount - 1;
    }
    else if (searchState.selectedResultIndex == searchState.resultCount) {
        searchState.selectedResultIndex = 0;
    }

    updateUI();
}


createSearchPanel();
createSearchButton();

$('#searchPanel input').on('input', onInputChange);
$('body').keypress(onKeypress);
$('#searchPanel').keyup(onArrowOrEnter);
$('button#wttSearch').click(onSearch);
