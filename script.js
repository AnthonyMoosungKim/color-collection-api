const API_KEY = 'b0f3e2c6-fd02-4132-9e16-1bcfad861f1b';
const API_URL = `https://api.harvardartmuseums.org/color?apikey=${API_KEY}&size=300`;

let collection = [];
let favorites = [];
let sortOrderAsc = true;

fetchData();
loadFavorites();

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        collection = data.records.filter(item => !favorites.find(fav => fav.colorid === item.colorid));
        renderCollection();
        renderFavorites();
        updateTotalDisplay();
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}

function renderCollection() {
    const collectionContainer = document.getElementById('collection');
    collectionContainer.innerHTML = '';

    collection.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('card');

        const name = item.name || 'No Name';
        const colorid = item.colorid || 'No Color ID';
        const color = item.hex || '#000000';

        itemCard.innerHTML = `
            <h3>${name}</h3>
            <p>${colorid}</p>
            <p>${color}</p>
            <div class="color" style="background-color:${color};"></div>
            <button onclick="addToFavorites(${item.colorid})">Add to Favorites</button>
        `;
        collectionContainer.appendChild(itemCard);
    });
}

function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';

    favorites.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('card');

        const name = item.name || "No Name";
        const colorid = item.colorid || "No Color ID";
        const color = item.hex || "#000000";

        itemCard.innerHTML = `
            <h3>${name}</h3>
            <p>${colorid}</p>
            <p>${color}</p>
            <div class="color" style="background-color:${color};"></div>
            <button onclick="removeFromFavorites(${item.colorid})">Remove from Favorites</button>
        `;
        favoritesContainer.appendChild(itemCard);
    });
}

function addToFavorites(colorid) {
    const item = collection.find(item => item.colorid === colorid);
    if (item) {
        favorites.push(item);
        collection = collection.filter(i => i.colorid !== colorid);
        saveFavorites();
        renderLists();
    }
}

function removeFromFavorites(colorid) {
    const item = favorites.find(item => item.colorid === colorid);
    if (item) {
        collection.push(item);
        favorites = favorites.filter(i => i.colorid !== colorid);
        sortCollection();
        saveFavorites();
        renderLists();
    }
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderLists() {
    renderCollection();
    renderFavorites();
    updateTotalDisplay();
}

function sortCollection() {
    collection.sort((a, b) =>
        sortOrderAsc? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
}

function toggleSort() {
    sortOrderAsc = !sortOrderAsc;
    collection.sort((a, b) => sortOrderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    favorites.sort((a, b) => sortOrderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    renderLists();
}

function calculateCollectionTotal() {
    return collection.length;
}

function calculateFavoritesTotal() {
    return favorites.length;
}

function updateTotalDisplay() {
    const totalCollection = document.getElementById('totalCollectionDisplay');
    const totalFavorites = document.getElementById('totalFavoritesDisplay');
    totalCollection.innerText = `Total Collection: ${calculateCollectionTotal()}`;
    totalFavorites.innerText = `Total Favorites: ${calculateFavoritesTotal()}`;
}