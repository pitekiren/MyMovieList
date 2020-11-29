// Deklarasi elemen DOM
const searchBtn = document.querySelector(".search-btn");
const modal = document.getElementById("detailModal");
const span = document.getElementsByClassName("close")[0];

async function placeHolderRun() {
  const movies = await getMovies("2020");
  // console.log(movies);
  updateUI(movies);
}
placeHolderRun();
//Event saat tombol search  ditekan
searchBtn.addEventListener("click", async function () {
  const inputKeyword = document.querySelector(".input-keyword");
  const movies = await getMovies(inputKeyword.value);
  // console.log(movies);
  updateUI(movies);
});

//Event saat Tombol enter ditekan ketika menulis di input keyword
document.querySelector(".input-keyword").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return;
  searchBtn.click();
  event.preventDefault();
});

//Event ketika tombol X ditekan pada Modal box/window
span.addEventListener("click", function () {
  modal.style.display = "none";
});

//Event ketika ruang bagian selain modal box ditekan
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Event ketika tombol detail ditekan
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("show-detail-btn")) {
    const imdbid = e.target.dataset.imdbid;
    modal.style.display = "block";
    console.log(imdbid);
    const detail = await showDetail(imdbid);
    updateUIdetail(detail);
  }
});

//Fungsi untuk mendapatkan data film dari API
function getMovies(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=2efeaa26&s=" + keyword)
    .then((response) => response.json())
    .then((response) => response.Search);
}
// function getMoviesByYear(keyword) {
//   return fetch("https://www.omdbapi.com/?apikey=2efeaa26&y=" + keyword)
//     .then((response) => response.json())
//     .then((response) => response.Search);
// }

// Fungsi untuk mengupdate UI ketika data dari API berhasil diambil
function updateUI(movies) {
  let cards = "";
  movies.forEach((movie) => {
    cards += showCards(movie);
  });
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// fungsi untuk mendapatkan data data detail film/series
function showDetail(id) {
  return fetch("https://www.omdbapi.com/?apikey=2efeaa26&i=" + id)
    .then((response) => response.json())
    .then((movie) => movie);
}

//Mengupdate UI pada modal box ketika data dari API berhasil diambil
function updateUIdetail(movie) {
  showModal(movie);
  const movieDetail = showModal(movie);
  const modalBody = document.querySelector(".modal-body");
  const modalFooter = document.querySelector(".modal-footer");
  modalBody.innerHTML = movieDetail;
  modalFooter.innerHTML = buyMovieLink(movie);
}

// Fungsi untuk menampilkan cards yang menampung data poster film
function showCards(movie) {
  return `<div class="card">
  <img src="${movie.Poster}" alt="${movie.Title}"/>
    <div class="card-body">
    <h5>${movie.Title}</h5>
    <h6>${movie.Year}</h6>
    </div class="card-footer">
    <button class="show-detail-btn" data-imdbid=${movie.imdbID}>Show Details</button>
    </div>`;
}

//Fungsi untuk menampilkan modal box yang menampung data detail film/series
function showModal(movie) {
  let ratings = "";
  // console.log(`Plot : ${movie.Plot} Genres : ${movie.Genre}`);
  movie.Ratings.forEach((rating) => {
    ratings += `<div>
      <h4>${rating.Value}</h4>
      <p>${rating.Source}</p>
      </div>`;
  });
  return `
  <div class="movie-poster">
    <img src="${movie.Poster}" alt="${movie.Poster}" id="poster"/>
    <div class="movie-ratings mt-1">
      <h5 class="bg-dark-ph rounded font-weight-bolder">Score : <span class="bg-dark-yellow-ph">${
        movie.imdbRating * 10
      }/100</span></h5>
    </div>
  </div>
  <div class="movie-properties">
  <div><h3>${movie.Title}(${movie.Year})</h3></div>
  <div><strong>Rated : </strong> ${movie.Rated}</div>
  <div><strong>Release Date : </strong>${movie.Released}</div>
  <div><strong>Genre : </strong>${movie.Genre}</div>
  <div><strong>Director : </strong>${movie.Director}</div>
  <div><strong>Writer : </strong> ${movie.Writer}</div>
  <div><strong>Language : </strong> ${movie.Language}</div>
  <div><strong>Awards : </strong> ${movie.Awards}</div>
  <div><strong>Production : </strong> ${movie.Production}</div>
  <div><strong>Plot : </strong> ${movie.Plot}</div>

  </div>
  
  `;
}

// Fungsi untuk generating link amazon
function buyMovieLink(movie) {
  if (movie.Type == "movie" || movie.Type == "series") {
    return `
  <a href="https://www.amazon.com/s?k=${movie.Title.replace(
    / /g,
    "+"
  )}&amp;i=movies-tv-intl-ship&amp;ref=nb_sb_noss?_encoding=UTF8&amp;camp=1789&amp;creative=9325&amp;linkCode=ur2&amp;tag=storypodca-20&amp;linkId=2P4S6EY6B462X4AR" target="_blank" rel="noopener noreferrer" style="border:none;text-decoration:none"><img src="https://www.niftybuttons.com/amazon/amazon-button7.png"></a>`;
  } else if (movie.Type == "game") {
    return `
  <a href="https://www.amazon.com/s?k=${movie.Title.replace(
    / /g,
    "+"
  )}&i=videogames-intl-ship&ref=nb_sb_noss" target="_blank"><img src="https://www.niftybuttons.com/amazon/amazon-button7.png"></a>`;
  } else {
    return `
  <a href="https://www.amazon.com/s?k=${movie.Title.replace(
    / /g,
    "+"
  )}&i=movies-tv-intl-ship&ref=nb_sb_noss" target="_blank"><img src="https://www.niftybuttons.com/amazon/amazon-button7.png"></a>`;
  }
}
