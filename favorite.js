const BASE_URL = "https://webdev.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/movies/";
const POSTER_URL = BASE_URL + "posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
const dataPanel = document.querySelector("#data-panel");

function renderMovieList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    //title image
    /*console.log(item);*/
    //data-id 為綁定id 而增加的 data-set
    rawHTML += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card" style="width: 18rem">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="電影圖片出錯"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer text-muted">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  movies.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    //資料都存放在response.data.results 使用一個變數裝入response
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release Date：" + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="API執行失敗" />`;
  });
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    /*console.log(event.target.dataset);*/
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
