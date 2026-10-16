let entertainment = [
  { id: 1, title: "Interstellar", mood: "Relax", rating: 9, category: "Movie" },
  { id: 2, title: "KGF", mood: "Motivated", rating: 8, category: "Movie" },
  { id: 3, title: "Mr Bean", mood: "Happy", rating: 7, category: "Movie" },
  { id: 4, title: "The Conjuring", mood: "Horror", rating: 8, category: "Movie" },
  { id: 5, title: "Your Name", mood: "Sad", rating: 9, category: "Anime" },
  { id: 6, title: "Naruto", mood: "Motivated", rating: 9, category: "Anime" },
  { id: 7, title: "Minecraft", mood: "Relax", rating: 8, category: "Game" },
  { id: 8, title: "Believer", mood: "Motivated", rating: 7, category: "Song" }
];

let cardsContainer = document.getElementById("cardsContainer");
let favoritesContainer = document.getElementById("favoritesContainer");
let recentContainer = document.getElementById("recentContainer");
let searchInput = document.getElementById("searchInput");

let currentMood = "All";
let currentCategory = "All";
let searchText = "";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

function renderCards(data) {
  if (data.length === 0) {
    cardsContainer.innerHTML = `<p class="empty">No Entertainment Found</p>`;
    return;
  }

  cardsContainer.innerHTML = data.map(item => {
    return `
      <div class="card">
        <h3>${item.title}</h3>
        <p>Mood: ${item.mood}</p>
        <p>Category: ${item.category}</p>
        <p>Rating: ${item.rating}</p>

        <div class="card-actions">
          <button onclick="addFavorite(${item.id})">Favorite</button>
          <button onclick="addRecent(${item.id})">View</button>
        </div>
      </div>
    `;
  }).join("");
}

function applyFilters() {
  let filteredData = entertainment.filter(item => {
    let moodMatch = currentMood === "All" || item.mood === currentMood;
    let categoryMatch = currentCategory === "All" || item.category === currentCategory;
    let searchMatch = item.title.toLowerCase().includes(searchText.toLowerCase());

    return moodMatch && categoryMatch && searchMatch;
  });

  renderCards(filteredData);
}

function renderFavorites() {
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `<p class="empty">No Favorites Added</p>`;
    return;
  }

  favoritesContainer.innerHTML = favorites.map(item => {
    return `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <p>Rating: ${item.rating}</p>
      </div>
    `;
  }).join("");
}

function renderRecent() {
  if (recent.length === 0) {
    recentContainer.innerHTML = `<p class="empty">No Recently Viewed Items</p>`;
    return;
  }

  recentContainer.innerHTML = recent.map(item => {
    return `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
      </div>
    `;
  }).join("");
}

function addFavorite(id) {
  let selectedItem = entertainment.find(item => item.id === id);

  let alreadyExists = favorites.find(item => item.id === id);

  if (alreadyExists) {
    alert("Already added to favorites");
    return;
  }

  favorites.push(selectedItem);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

function addRecent(id) {
  let selectedItem = entertainment.find(item => item.id === id);

  recent.unshift(selectedItem);

  if (recent.length > 4) {
    recent.pop();
  }

  localStorage.setItem("recent", JSON.stringify(recent));
  renderRecent();
}

let moodButtons = document.querySelectorAll(".mood-btn");

moodButtons.forEach(button => {
  button.addEventListener("click", function () {
    currentMood = button.dataset.mood;
    applyFilters();
  });
});

let categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
  button.addEventListener("click", function () {
    currentCategory = button.dataset.category;
    applyFilters();
  });
});

searchInput.addEventListener("input", function () {
  searchText = searchInput.value;
  applyFilters();
});

document.getElementById("highRatingBtn").addEventListener("click", function () {
  let sortedData = [...entertainment].sort((a, b) => b.rating - a.rating);
  renderCards(sortedData);
});

document.getElementById("lowRatingBtn").addEventListener("click", function () {
  let sortedData = [...entertainment].sort((a, b) => a.rating - b.rating);
  renderCards(sortedData);
});

document.getElementById("randomBtn").addEventListener("click", function () {
  let randomIndex = Math.floor(Math.random() * entertainment.length);
  renderCards([entertainment[randomIndex]]);
});

document.getElementById("themeBtn").addEventListener("click", function () {
  document.body.classList.toggle("dark");

  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

loadTheme();
renderCards(entertainment);
renderFavorites();
renderRecent();
