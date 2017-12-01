/*
 * When on watchlist page, scrape all profile data and save to localstorage
 */


function build(result, value, key) {
    const profile = value.href.match(/wiki\/(.*)$/)[1];
    result[profile] = { 'name': value.innerText, 'url': value.href };
    return result;
}


console.log('WikiTreeTurbo: reading profile data from this page');

const links = $('table tr td:first-child a:first-child');
const result = _.reduce(links, build, {});
localStorage.setItem('wikitreeturbo_watchlist', JSON.stringify(result));

console.log('WikiTreeTurbo: watchlist data saved to localstorage');
