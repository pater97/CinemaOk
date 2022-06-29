//fare in modo che se selezione serie o movie la stinga api cambi variabile
//inniettare i film tramite javascript

let searchInput = document.getElementById('searchInput')
const api = 'https://api.themoviedb.org/3/search/'
const apiKey = 'api_key=f4f382566368553eb6b723d584f2ef40'

let movies = []

function prova() {
  console.log('fammi capire')
}

function getMovie() {
  // pulisco l'array dalle chiamate fatte in precedenza
  movies = []
  axios
    .get(
      `
    ${api}movie?${apiKey}&language=en-US&query=${searchInput.value}&page=1&include_adult=false`
    )
    .then((response) => {
      const singleObject = response.data.results
      for (let i = 0; i < singleObject.length; i++) {
        movies.push(singleObject[i])
      }
      console.log(movies)
    })
    .catch((e) => {
      console.log(e)
    })
}
