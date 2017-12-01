/*
 * Quick search your watchlist by pressing backquote (`) on your keyboard
 */


let state = {
    searchPanelActive: false,
    selectedResultIndex: 0,
    triggerSelection: false
};


const profiles = JSON.parse(localStorage.getItem('wikitreeturbo_watchlist'));


function updateUI() {

    // show/hide panel
    if (state.searchPanelActive) {
        $('#searchPanel').show();
        $('#searchPanel input').focus();
    } else {
        $('#searchPanel').hide();
    }

    // highlight a result
    $('#searchPanel ul li').removeClass('selected');
    $(`#searchPanel ul li:nth-child(${state.selectedResultIndex+1})`).addClass('selected');

    // select result
    if (state.triggerSelection) {
        $(`#searchPanel ul li:nth-child(${state.selectedResultIndex+1}) a`)[0].click();
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
        <p>ARROW UP/DOWN to select<br>
        ENTER to open<br>
        ESC or BACKQUOTE (\`) to close</p>
    </div>
`);
    $('body').append(div);
}


function onInputChange(e) {

    state.selectedResultIndex = 0;    

    if (profiles == null) {
        alert('No watchlist data found. Please visit your watchlist page, then try again.');
        return;
    }

    const s = $('#searchPanel input').val();
    const f = _.partial(isMatch, s);
    renderMatches(_.pickBy(profiles, f));
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

    updateUI();    
}


function onEnter(e) {
    console.log('enter');
}


createSearchPanel();

$('#searchPanel input').on('input', onInputChange);
$('body').keypress(onBackquote);
$('#searchPanel').keypress(onArrowOrEnter);
