//fare in modo che se seleziono serie o movie la stinga api cambi variabile
//inniettare i film tramite javascript

let searchInput = document.getElementById('searchInput')
const container = document.getElementById('results')
const api = 'https://api.themoviedb.org/3/search/'
const apiKey = 'api_key=f4f382566368553eb6b723d584f2ef40'

let movies = []

function getMovie() {
  // pulisco l'array dalle chiamate fatte in precedenza
  movies = []
  axios
    .get(
      `
    ${api}movie?${apiKey}&language=en-US&query=${searchInput.value}&page=1&include_adult=false`
    )
    .then((response) => {
      container.innerHTML = ''
      const singleObject = response.data.results
      for (let i = 0; i < singleObject.length; i++) {
        container.insertAdjacentHTML(
          'beforeend',
          `
        <article class="card_container">
            <div class="card_content">
              <a href="/movies/${singleObject[i].id}">
                <img src="https://image.tmdb.org/t/p/original/${singleObject[i].poster_path}" alt="">
                <h2>${singleObject[i].original_title}</h2>
              </a>
            </div>
        </article>
        `
        )
        movies.push(singleObject[i])
      }
      console.log(movies)
    })
    .catch((e) => {
      console.log(e)
    })
}
