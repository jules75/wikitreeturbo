
// reducing fn
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

