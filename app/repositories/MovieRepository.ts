//importo il modello movie fatto in precedenza
import { Movie } from 'App/Models/Movie'
//importo il modello video per estrapolare il trailer
import { Video } from 'App/Models/Video'
//importo il modello delle recensioni
import { Reviews } from 'App/Models/Reviews'
//importo api helper ovvero uno schema per le richieste api
import ApiHelper from 'App/Helpers/ApiHelper'
//importo env dove avrò la chiave per le richieste api
import Env from '@ioc:Adonis/Core/Env'

class MovieRepository {
  //metto in una variabile l'url base così da non ripeterlo
  private baseUrl = 'https://api.themoviedb.org/3'
  //eseguo chiamata axios per i film popolare (utilizzato nella home)
  public async popular(): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/popular`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makePMovies(response)
  }
  //eseguo chiamata axios per i film popolare (utilizzato nella home)
  public async upcoming(): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/upcoming`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeUpMovies(response)
  }
  //eseguo chiamata axios per i film popolare (utilizzato nella home)
  public async onTheatres(): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/now_playing`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeOnMovies(response)
  }
  //chiamata film meglio votati
  public async top(): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/top_rated`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeTopMovies(response)
  }
  //cerco by id (vista show)
  public async findById(id: number): Promise<Movie> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/movie/${id}`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
      },
    })

    return this.makeMovie(response)
  }
  //eseguo chiamata axios x film simili
  public async similar(id: number): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/${id}/similar`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeSimilarMovies(response)
  }
  //chiamo la lista dei trailer per id del film
  public async VideoTrailer(id: number): Promise<Array<Video>> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/movie/${id}/videos`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'en-US',
      },
    })
    return this.keyTrailer(response)
  }
  //chiamata per le recensioni
  public async getReviews(id: number): Promise<Array<Reviews>> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/movie/${id}/reviews`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'en-US',
      },
    })
    return this.reviews(response)
  }
  //costrutto singolo film
  private makeMovie(data: any): Movie {
    return new Movie({
      title: data.title,
      overview: data.overview,
      backdrop: data.backdrop_path,
      date: data.release_date,
      rank: data.vote_average,
      id: data.id,
      homepage: data.homepage,
      genres: data.genres,
    })
  }
  //costrutto del trailer
  private makeKeyTrailer(data: any): Video {
    return new Video({
      key: data.key,
    })
  }
  //costrutto delle recensioni
  private makeReviews(data: any): Reviews {
    return new Reviews({
      author: data.author_details,
      content: data.content,
      created_at: data.created_at,
    })
  }

  //ritorno i film più popolari
  private makePMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
  //ritorno i film attualmente in sala
  private makeOnMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
  //ritorno i film meglio valutati
  private makeTopMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
  //ritorno le prossime uscite
  private makeUpMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
  //serie tv simili
  private makeSimilarMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
  // ritorno i trailer video
  private keyTrailer(data: any): Array<Video> {
    return data.results.map((r) => this.makeKeyTrailer(r))
  }
  // ritorno le recensioni
  private reviews(data: any): Array<Reviews> {
    return data.results.map((r) => this.makeReviews(r))
  }
}

export default new MovieRepository()
