const BASE_URL = "https://webdev.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/movies/";
const POSTER_URL = BASE_URL + "posters/";
var movies = [];
const dataPanel = document.querySelector("#data-panel");

//search form
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
let filteredMovies = [];

//paginator 分頁器
const MOVIES_PER_PAGE = 12;
const paginator = document.querySelector("#paginator");

//動態產生HTML 元素
function renderMovieList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    //title image
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
                <button class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">+</button>
              </div>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//MovieModal
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

//分頁器功能
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;

  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

//分頁器 顯示功能
function renderPaginator(amount) {
  //Math.ceil 無條件進位
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

//分頁器監聽器
paginator.addEventListener("click", function onPaginator(event) {
  if (event.target.tagName != "A") return;
  const page = Number(event.target.dataset.page);

  renderMovieList(getMoviesByPage(page));
});

//收藏功能
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  console.log(typeof list);

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

//dataPanel 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    //收藏功能
    addToFavorite(Number(event.target.dataset.id));
  }
});

//針對searchForm 的監聽器
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  // map, filter, reduce
  filteredMovies = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(keyword);
  });

  if (filteredMovies.length === 0) {
    return alert("Cannot find movie with " + keyword);
  }
  /* for of 寫法
  for (const movie of movies){
    if (movie.title.toLowerCase().includes(keyword)){
      filteredMovies.push(movie);
    }
  }
  */
  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

//使用...
//使用axios 串接第三方API 取得第一次的總資料 並呼叫renderMovieList方法 傳入參數為 先經過分頁器方法 而傳入回傳值
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => {
    console.log(err);
  });
console.log(movies.length);
/* 使用 for of
axios.get(INDEX_URL).then((response) => {
  for (const movie of response.data.results) {
    movies.push(movie);
  }
  console.log(movies);
}).catch((err) => {
  console.log(err);
})
  */
