/*
 * When on profile page, scrape single profile data and save to localstorage
 */


if ($('body.profile').length > 0) { // avoid getting non-profile wiki pages

    const key = 'wikitreeturbo_watchlist';
    const s = localStorage.getItem(key);
    const profile = location.href.match(/wiki\/(.*)$/)[1]
    const name = $('h1 span[itemprop="name"]').text();

    let profs = JSON.parse(s) || {};

    const profileAlreadyExists = Boolean(profs[profile]);

    profs[profile] = {
        'name': name,
        'url': location.href,
        'born': $('time[itemprop="birthDate"]').text()
    };

    localStorage.setItem(key, JSON.stringify(profs));

    if (!profileAlreadyExists) {
        toast(name + " added to quick search index");
    }

}
