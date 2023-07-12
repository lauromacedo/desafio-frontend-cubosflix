const searchInput = document.querySelector(".input");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const movieDay = document.querySelector('.movie-of-the-day');
const movie = document.querySelector('.movie');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const modalBody = document.querySelector('.modal__body');
const closeModalBtn = document.querySelector('.modal__close');
const root = document.querySelector(':root');
const btnTheme = document.querySelector(".btn-theme");
const moviesHtml = document.querySelector('.movies');
const body = document.querySelector('body');
const cubosLogo = document.querySelector('.logo-svg');

let moviesData = [];
let firstMovie = 0;
let lastMovie = 6;

async function loadPage() {
  moviesData = await getMovies();
  renderMovies(moviesData);
}
loadPage();

function renderMovies(moviesData) {
  moviesHtml.innerHTML = '';
  moviesData.slice(firstMovie, lastMovie).forEach((movie) => {
    let newMovie = document.createElement("div");
    newMovie.classList.add('movie');
    newMovie.style.backgroundImage = `url(${movie.poster_path})`;
    moviesHtml.appendChild(newMovie);
    newMovie.addEventListener('click', async () => {
      modal.classList.remove('hidden');
      const response = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`);
      const filterModal = response.data;

      modalTitle.textContent = `${filterModal.title}`;
      modalImg.setAttribute('src', `${filterModal.backdrop_path}`);
      modalDescription.textContent = `${filterModal.overview}`;
      modalAverage.textContent = `${filterModal.vote_average.toFixed(1)}`;

      modalGenres.innerHTML = ''
      filterModal.genres.slice(0, 6).forEach(genre => {
        const genreModal = document.createElement('span');
        genreModal.classList.add('modal__genre');
        genreModal.textContent = `${genre.name}`;
        modalGenres.appendChild(genreModal)
      });
    })

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');
    newMovie.appendChild(movieInfo);

    const firstSpan = document.createElement('span');
    firstSpan.classList.add('movie__title');
    firstSpan.textContent = `${movie.title}`;
    movieInfo.appendChild(firstSpan);

    const secondSpan = document.createElement('span');
    secondSpan.classList.add('movie__rating');
    secondSpan.textContent = `${movie.vote_average}`;
    movieInfo.appendChild(secondSpan);

    const starImg = document.createElement('img');
    starImg.setAttribute('src', "./assets/estrela.svg");
    starImg.setAttribute('alt', 'Estrela');
    secondSpan.appendChild(starImg);
  })
}

nextBtn.addEventListener('click', () => {
  firstMovie += 6;
  lastMovie += 6;
  if (lastMovie > 18) {
    firstMovie = 0;
    lastMovie = 6;
  }
  renderMovies(moviesData)
})

prevBtn.addEventListener('click', () => {
  if (firstMovie === 0) {
    firstMovie += 12;
    lastMovie += 12;
  } else {
    firstMovie -= 6;
    lastMovie -= 6;
  }
  renderMovies(moviesData)
})

async function getMovieOfTheDay() {
  try {
    const responseGeneral = await axios.get(urlMovieDay);
    const responseVideo = await axios.get(urlVideo);
    const filterGeneralData = responseGeneral.data;
    const filterVideo = responseVideo.data;

    movieDay.innerHTML = `
    <div class="highlight size">
      <a class="highlight__video-link" href="https://www.youtube.com/watch?v=${filterVideo.results[0].key}" target="_blank">
        <div class="highlight__video" style=" background-image: url(${filterGeneralData.backdrop_path}); background-size: cover;">
          <img src="./assets/play.svg" alt="Play" />
        </div>
      </a>
      <div class="highlight__info">
        <div class="highlight__title-rating">
          <h3 class="highlight__title">${filterGeneralData.title}</h3>
          <span class="highlight__rating">${filterGeneralData.vote_average.toFixed(1)}</span>
        </div>
        <div class="highlight__genre-launch">
          <span class="highlight__genres">${filterGeneralData.genres[0].name}, ${filterGeneralData.genres[1].name},
          ${filterGeneralData.genres[2].name}</span>
          <span class="highlight__launch"> / ${filterGeneralData.release_date}</span>
        </div>
        <p class="highlight__description">${filterGeneralData.overview}</p>
      </div>
    </div>
    `
  } catch (error) {
    return error
  }
}
getMovieOfTheDay()

searchInput.addEventListener("keydown", async (event) => {
  try {
    const query = searchInput.value;
    const response = await axios.get(searchUrl + query);
    const filterSearch = response.data;

    if (event.key === 'Enter' && searchInput.value.length > 0) {
      moviesData = filterSearch.results;
      renderMovies(moviesData);
      searchInput.value = ""
    } else if (!searchInput.value.length) {
      moviesData = await getMovies()
      firstMovie = 0;
      lastMovie = 6
      renderMovies(moviesData);
    }
  } catch (error) {
    return error
  }
})

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden')
});

modalBody.addEventListener('click', () => {
  modal.classList.add('hidden')
})

btnTheme.addEventListener('click', () => {
  body.classList.toggle('dark');

  if (body.classList.contains('dark')) {
    root.style.setProperty('--background', '#1b2028');
    root.style.setProperty('--text-color', '#fff');
    root.style.setProperty('--bg-secondary', '#2D3440');
    root.style.setProperty('--input-color', '#fff');
    searchInput.style.backgroundColor = '#3E434D';
    searchInput.style.borderColor = '#665F5F'
    btnTheme.setAttribute('src', './assets/dark-mode.svg');
    cubosLogo.setAttribute('src', './assets/logo.svg');
    prevBtn.setAttribute('src', './assets/arrow-left-light.svg');
    nextBtn.setAttribute('src', './assets/arrow-right-light.svg');
    closeModalBtn.setAttribute('src', './assets/close.svg');
  } else {
    root.style.setProperty('--background', '#fff');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--bg-secondary', '#ededed');
    root.style.setProperty('--input-color', '#979797');
    searchInput.style.backgroundColor = '#fff';
    searchInput.style.borderColor = '#1B2028'
    btnTheme.setAttribute('src', './assets/light-mode.svg');
    cubosLogo.setAttribute('src', './assets/logo-dark.png')
    prevBtn.setAttribute('src', './assets/arrow-left-dark.svg');
    nextBtn.setAttribute('src', './assets/arrow-right-dark.svg');
    closeModalBtn.setAttribute('src', './assets/close-dark.svg');
  }
})