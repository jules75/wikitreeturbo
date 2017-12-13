/*
 * When on watchlist page, scrape all profile data and save to localstorage
 */


const key = 'wikitreeturbo_watchlist';
const rows = _.drop($('table tr'), 1);
const s = localStorage.getItem(key);
const profs = JSON.parse(s) || {};
const result = _.reduce(rows, build, profs);

localStorage.setItem(key, JSON.stringify(result));

toast(_.size(result) + " profiles added to quick search index");