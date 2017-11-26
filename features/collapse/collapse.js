
/* Allow user to collapse/expand levels in descendant tree */


function toggleCollapse(e) {
    const s = $(e.target).text();
    $(e.target).text(s=='-' ? '+' : '-');
    $(e.target.parentElement.nextElementSibling).toggle();
}

function isNextSiblingDiv(el) {
    if(el.nextElementSibling) {
        if (el.nextElementSibling.tagName=="DIV") {
            return true;
        }
    }
    return false;
}

function createButton(n, li) {

    // attach class to avoid adding button more than once
    if (li.classList.contains('collapse')) {
        return;
    }

    if (!isNextSiblingDiv(li)) {
        return;
    }

    $(li).addClass('collapse');
    const button = $("<button class='wikitreeturbo'>-</button>");
    $(button).click(toggleCollapse);
    $(li).prepend(button);
}

$('ol li').each(createButton);

// in case content is added dynamically
$(document).bind("DOMSubtreeModified", function() {
    $('ol li').each(createButton);
});