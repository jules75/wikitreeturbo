/*
 * Quick search your watchlist by pressing backquote (`) on your keyboard
 */


let state = {
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
    if (state.searchPanelActive) {
        $('#searchPanel').slideDown(100);
        $('#searchPanel input').focus();
    } else {
        $('#searchPanel').slideUp(100);
    }

    // highlight a result
    $('#searchPanel ul li').removeClass('selected');
    $(`#searchPanel ul li:nth-child(${state.selectedResultIndex + 1})`).addClass('selected');

    // select result
    if (state.triggerSelection) {
        $(`#searchPanel ul li:nth-child(${state.selectedResultIndex + 1}) a`)[0].click();
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
            After you've done that, reload any WikiTree page, then quick search will work.<br><br>
            Be sure to visit your watchlist page occasionally to keep quick search up to date.
            </div>
        <p>ARROW UP/DOWN to select<br>
        ENTER to open<br>
        ESC or BACKQUOTE (\`) to close</p>
    </div>
`);
    $('body').append(div);
}


function onInputChange(e) {

    state.selectedResultIndex = 0;

    const s = $('#searchPanel input').val();
    const f = _.partial(isMatch, s);
    const result = (s.length > 0) ? _.pickBy(profiles, f) : {};

    state.resultCount = _.size(result);
    renderMatches(result);
}


// separate fn to supress keypress
function onBackquote(e) {
    if (e.originalEvent.code == 'Backquote') {
        state.searchPanelActive = !state.searchPanelActive;
        updateUI();
        e.preventDefault();
    }
}


function onArrowOrEnter(e) {

    code = e.originalEvent.code;

    if (code == 'ArrowDown') {
        state.selectedResultIndex++;
    }
    else if (code == 'ArrowUp') {
        state.selectedResultIndex--;
    }
    else if (code == 'Enter') {
        state.triggerSelection = true;
    }
    else if (code == 'Escape') {
        state.searchPanelActive = false;
    }

    if (state.selectedResultIndex < 0) {
        state.selectedResultIndex = state.resultCount - 1;
    }
    else if (state.selectedResultIndex == state.resultCount) {
        state.selectedResultIndex = 0;
    }

    updateUI();
}


createSearchPanel();

$('#searchPanel input').on('input', onInputChange);
$('body').keypress(onBackquote);
$('#searchPanel').keyup(onArrowOrEnter);
