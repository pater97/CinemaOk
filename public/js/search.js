const searchInput = document.getElementById('search')
let movies = []

function getMovie(query){
  axios
    .get(`
    https://api.themoviedb.org/3/search/movie?api_key=f4f382566368553eb6b723d584f2ef40&language=en-US&query=${query}&page=1&include_adult=false`)
    .then((response) => {
      const singleObject = response.data.results;
      for (let i = 0; i < singleObject.length; i++) {
        movies.push(singleObject[i]);
      }
      console.log(movies);
    })
    .catch((e) => {
      console.log(e);
    });
}

function prova(){
  console.log('prova')
  console.log(searchInput.value)
}