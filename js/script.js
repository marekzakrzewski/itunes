const url = 'https://itunes.apple.com/us/rss/topalbums/limit=100/json'
const jsonRequest = new XMLHttpRequest();
let data = '';
let albums = '';
let countI = 0;
let countN = 12;
const inputSearch = document.querySelector('.itunes__search--item input');
const clearSearch = document.querySelector('.itunes__search--clear');
const showSort = document.querySelector('.itunes__sort--open span');
const sortBtn = document.querySelector('.itunes__sort--button');
const goToTop = document.querySelector('.goToTop');

// Get JSON
jsonRequest.open('GET', url, true);
jsonRequest.onload = function() {
    data = JSON.parse(jsonRequest.responseText)
    albums = data.feed.entry;
    albums.map((album, index) => {
        album.index = ++index;
    });
    jsonDisplay(albums);
}
jsonRequest.send()


// Display JSON
function jsonDisplay(albums) {

    for (let i = countI; i < countN; i++) {
        if (i >= albums.length) {
            window.removeEventListener('scroll', scrollCheck);
            showMore();
            return;
        }
        $('.itunes__cont').append(itunes(albums[i]));
    }
    showMore();
    countI += 12;
    countN += 12;
}
// Prepare HTML
function itunes(album) {
    let html = `
        <div class="itunes__post">
            <div class="itunes__cover--container">
                <picture class="itunes__cover--picture">
                    <source media="(max-width: 460px)" srcset="${album["im:image"][0].label}" >
                    <source media="(max-width: 720px)" srcset="${album["im:image"][1].label}" >
                    <img src="${album["im:image"][2].label}" alt="Album cover">
                </picture>
                <div class="itunes__desc--container">
                    <div class="itunes__desc--wrap">
                        <p>Category: <strong>${album.category.attributes.label}</strong></p>
                        <p>Realese date: <strong>${album["im:releaseDate"].attributes.label}</strong></p>
                        <p>Price: <strong>${album["im:price"].label}</strong></p>
                    </div>
                </div>
                <div class="itunes__id--container">
                    <span class="itunes__id--number">${album.index}</span>
                </div>
            </div>
            <div class="itunes__meta--container">
                <h1 class="itunes__meta--title">${album["im:name"].label}</h1>
                <h2 class="itunes__meta--artist">${album["im:artist"].label}</h2>
                <div class="itunes__more--container">
                    <div class="itunes__more--show">
                        <span class="itunes__show--item">more</span>
                    </div>
                    <div class="itunes__more--link">
                        <span class="itunes__link--item">Get now!</span>
                        <a class="itunes__link--link" href="${album.link.attributes.href}" target="_blank"></a>
                    </div>
                </div>
                
            </div>
        </div>
        `;
    return html;
}

// Show details
function showDetails(e) {
    let parent = e.target.parentNode.parentNode.parentNode;
    if (!parent.classList.contains('slide')) {
        parent.querySelector('.itunes__cover--picture img').setAttribute('style', 'animation: slide-left 0.5s ease-out forwards')
        parent.querySelector('.itunes__desc--wrap').setAttribute('style', 'animation: slide-right 0.5s ease-out forwards');
        parent.classList.toggle('slide');
    } else {
        parent.querySelector('.itunes__cover--picture img').setAttribute('style', 'animation: slide-left-back 0.5s ease-out backwards')
        parent.querySelector('.itunes__desc--wrap').setAttribute('style', 'animation: slide-right-back 0.5s ease-out backwards');
        parent.classList.toggle('slide');
    }
}

// Display more items
function scrollCheck() {
    if (!document.querySelector('.itunes__cont').classList.contains('searchResults')) {
        let docH = $(document).height();
        let contBottom = window.innerHeight + window.scrollY;
        if (docH == contBottom) {
            jsonDisplay(albums);
        }
    }
};

// RegExp find
function find(wordToMatch, albums) {
    return albums.filter(album => {
        let regex = new RegExp(wordToMatch, 'gi');
        return album["im:name"].label.match(regex) || album["im:artist"].label.match(regex) || album.category.attributes.label.match(regex);
    });
}
// Display albums
function displayAlbums(albums) {
    document.querySelector('.itunes__cont').innerHTML = '';
    albums.forEach(album => {
        $('.itunes__cont').append(itunes(album));
    })
    showMore();
}

// Display search results
function displayResults(e) {

    document.querySelector('.itunes__cont').classList.add('searchResults');

    if (inputSearch.value.length > 0) {
        clearSearch.setAttribute('style', 'display: block');
    } else {
        clearSearch.setAttribute('style', 'display: none');
    }

    let arr = find(e.target.value, albums);
    displayAlbums(arr);
}

// Show scroll top
(function showScrollToTop() {
    document.addEventListener('scroll', function() {
        if (window.scrollY > (window.innerHeight / 2)) {
            goToTop.setAttribute('style', 'opacity: 1');
        } else {
            goToTop.setAttribute('style', 'opacity: 0');
        }
    })
})();

// Scroll top
(function scrollToTop() {
    goToTop.addEventListener('click', function() {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    });
})();

// Sort albums
function sortAlbums() {
    let sorted;
    let display = document.querySelector('input[name="displayBy"]:checked').value;
    let sort = document.querySelector('input[name="sortBy"]:checked').value;
    type = display + sort;
    switch (type) {
        case 'azTitle':
            sorted = albums.sort((a, b) => {
                return (a["im:name"].label.toUpperCase() > b["im:name"].label.toUpperCase()) ? 1 : -1;
            });
            break;
        case 'zaTitle':
            sorted = albums.sort((a, b) => {
                return (a["im:name"].label.toUpperCase() > b["im:name"].label.toUpperCase()) ? -1 : 1;
            });
            break;
        case 'azName':
            sorted = albums.sort((a, b) => {
                return (a["im:artist"].label.toUpperCase() > b["im:artist"].label.toUpperCase()) ? 1 : -1;
            });
            break;
        case 'zaName':
            sorted = albums.sort((a, b) => {
                return (a["im:artist"].label.toUpperCase() > b["im:artist"].label.toUpperCase()) ? -1 : 1;
            });
            break;
    }
    document.querySelector('.itunes__cont').innerHTML = '';
    sorted.forEach(album => {
        $('.itunes__cont').append(itunes(album));
    })
    showMore();
}


// loadJSON();
window.addEventListener('scroll', scrollCheck);
document.addEventListener("touchmove", function() {
    displayAlbums(albums);
});


// Add event listeners
function showMore() {
    let more = document.querySelectorAll('.itunes__more--show');
    more.forEach(btn => {
        btn.addEventListener('click', showDetails);
    })
}
inputSearch.addEventListener('keyup', displayResults);
inputSearch.addEventListener('change', displayResults);
clearSearch.addEventListener('click', function() {
    inputSearch.value = ''
    clearSearch.setAttribute('style', 'display: none');
    displayAlbums(albums);
});
showSort.addEventListener('click', function() {
    document.querySelector('.itunes__sort--innerContainer').classList.toggle('hide');
});
sortBtn.addEventListener('click', sortAlbums);