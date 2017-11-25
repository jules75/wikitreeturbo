
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
    if (isNextSiblingDiv(li)) {
        const button = $("<button>-</button>");
        $(button).click(toggleCollapse);
        $(li).prepend(button);
    }
}


$('ol li').each(createButton);

