/*
 * When on watchlist page, scrape all profile data and save to localstorage
 */


function build(result, value, key) {

    const td1 = $(value).children().eq(0);
    const link = $(td1).children('a')[0];

    const td2 = $(value).children().eq(1)[0];
    const profile = link.href.match(/wiki\/(.*)$/)[1];

    result[profile] = {
        'name': link.innerText,
        'url': link.href,
        'born': td2.innerText
    };

    return result;
}


console.log('WikiTreeTurbo: reading profile data from this page');

const rows = _.drop($('table tr'), 1);
const result = _.reduce(rows, build, {});
localStorage.setItem('wikitreeturbo_watchlist', JSON.stringify(result));

console.log('WikiTreeTurbo: watchlist data saved to localstorage');
