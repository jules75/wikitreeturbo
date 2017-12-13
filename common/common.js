
// display a 'toast' (fading message) in top right corner
function toast(msg) {
    const el = $(`<p id="toast">${msg}</p>`);
    $('body').prepend(el);
    $(el).fadeOut(4000);
}