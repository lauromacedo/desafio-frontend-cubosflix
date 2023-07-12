const urlMovies = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false';
const urlMovieDay = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR";
const urlVideo = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR";
const searchUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=";

async function getMovies() {
  try {
    const response = await axios.get(urlMovies);
    const filterData = response.data.results.slice(0, 18);
    return filterData

  } catch (error) {
    return error
  }
}



