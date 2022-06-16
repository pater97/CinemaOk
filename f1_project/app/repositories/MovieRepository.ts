//importo il modello movie fatto in precedenza
import { Movie } from 'App/Models/Movie'
//importo api helper ovvero uno schema per le richieste api
import ApiHelper from 'App/Helpers/ApiHelper'
//importo env dove avrò la chiave per le richieste api
import Env from '@ioc:Adonis/Core/Env'

class MovieRepository {
  //metto in una variabile l'url base così da non ripeterlo
  private baseUrl = 'https://api.themoviedb.org/3'
  //eseguo chiamata axios
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

    return this.makeMovies(response)
  }

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

  private makeMovie(data: any): Movie {
    return new Movie({
      title: data.title,
      overview: data.overview,
      backdrop: data.backdrop_path,
    })
  }

  private makeMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
}

export default new MovieRepository()
