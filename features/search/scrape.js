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


const key = 'wikitreeturbo_watchlist';
const rows = _.drop($('table tr'), 1);
const s = localStorage.getItem(key);
const profs = JSON.parse(s) || {};
const result = _.reduce(rows, build, profs);

localStorage.setItem(key, JSON.stringify(result));

toast(_.size(result) + " profiles added to quick search index");