
const pageProfiles = getProfiles();


const faceData = [
    {
        "x": 28.71,
        "y": 37.64,
        "profile": "Lacey-1616"
    },
    {
        "x": 41.24,
        "y": 28.16,
        "profile": "Laffey-101"
    },
    {
        "x": 60.99,
        "y": 33.05,
        "profile": "Parrot-128"
    },
    {
        "x": 47.86,
        "y": 43.96,
        "profile": "Dunn-10271"
    },
    {
        "x": 67.20,
        "y": 56.61,
        "profile": "Laffey-98"
    }
];


// create tooltip
$('body').append($('<div id="tooltip">'));


// true if numbers are nearly equal
function nearly(n, m) {
    const delta = 5;
    return Math.abs(n - m) < delta;
}


// return all profile data found in current page
function getProfiles() {
    const sel = '[itemtype="https://schema.org/Person"] a';
    return _.map($(sel), function (el) {
        return {
            target: el,
            href: el.href,
            name: el.innerText,
            profile: el.href.match(/\w+\-\d+.*$/)[0]
        };
    });
}


function onMouseMove(e) {

    const x = e.originalEvent.offsetX / e.target.width * 100;
    const y = e.originalEvent.offsetY / e.target.height * 100;

    function match(o) {
        return nearly(o.x, x) && nearly(o.y, y);
    }

    const faceItem = _.find(faceData, match);
    if (faceItem) {

        function f(item) {
            return item.profile==faceItem.profile;
        }

        const profile = _.find(pageProfiles, f);

        $(profile.target).addClass('highlight');

        $('#tooltip').show();
        $('#tooltip').text(profile.name);
        $('#tooltip').css('left', (e.clientX + 20) + 'px');
        $('#tooltip').css('top', (e.clientY + 20) + 'px');
    }
    else {
        $('#tooltip').hide();
        _.map(pageProfiles, function(p) { $(p.target).removeClass('highlight')});
    }
}


$("img[itemprop='image']").on('mousemove', onMouseMove);
