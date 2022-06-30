let searchInput = document.getElementById('searchInput')
const container = document.getElementById('results')
let selectType = document.getElementById('type')
const api = 'https://api.themoviedb.org/3/search/'
const apiKey = 'api_key=f4f382566368553eb6b723d584f2ef40'

function getMovie() {
  console.log(selectType.value)
  container.innerHTML = ''
  axios
    .get(
      `
    ${api}${selectType.value}?${apiKey}&language=en-US&query=${searchInput.value}&page=1&include_adult=false`
    )
    .then((response) => {
      const singleObject = response.data.results
      if (singleObject[0].original_title === undefined) {
        for (let i = 0; i < singleObject.length; i++) {
          container.insertAdjacentHTML(
            'beforeend',
            `
          <article class="card_container">
              <div class="card_content">
                <a href="/series/${singleObject[i].id}">
                  <img src="${noimage(singleObject[i].poster_path)}" alt="">
                  <h2>${singleObject[i].original_name}</h2>
                </a>
              </div>
          </article>
          `
          )
          console.log(singleObject[i].original_title)
        }
      } else {
        for (let i = 0; i < singleObject.length; i++) {
          container.insertAdjacentHTML(
            'beforeend',
            `
          <article class="card_container">
              <div class="card_content">
                <a href="/movies/${singleObject[i].id}">
                  <img src="${noimage(singleObject[i].poster_path)}" alt="">
                  <h2>${singleObject[i].original_title}</h2>
                </a>
              </div>
          </article>
          `
          )
          console.log(singleObject[i].original_title)
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

function noimage(image) {
  if (image === null) {
    return 'https://preview.redd.it/z9xed4f4guw71.jpg?auto=webp&s=7e7cd9550853af5caa7a3f805b1f8edc11f59fe1'
  }
  return `https://image.tmdb.org/t/p/original/${image}`
}
