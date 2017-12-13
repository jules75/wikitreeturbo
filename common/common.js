
// display a 'toast' (fading message) in top right corner
function toast(msg) {
    const el = $(`
    <div id="toast-container" class="toast-top-right">
        <div class="toast toast-success" aria-live="polite" style="display: block;">
            <div class="toast-message">${msg}</div>
        </div>
    </div>
    `);
    $('body').prepend(el);
    $(el).delay(4000).fadeOut(1000);
}

