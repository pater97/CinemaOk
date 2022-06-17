//importo il modello movie fatto in precedenza
import { Serie } from 'App/Models/Serie'
//importo api helper ovvero uno schema per le richieste api
import ApiHelper from 'App/Helpers/ApiHelper'
//importo env dove avrò la chiave per le richieste api
import Env from '@ioc:Adonis/Core/Env'

class SerieRepository {
  //metto in una variabile l'url base così da non ripeterlo
  private baseUrl = 'https://api.themoviedb.org/3'
  //eseguo chiamata axios
  public async popular(): Promise<Array<Serie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/tv/popular`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeSeries(response)
  }

  public async findById(id: number): Promise<Serie> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/tv/${id}`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
      },
    })

    return this.makeSerie(response)
  }

  private makeSerie(data: any): Serie {
    return new Serie({
      name: data.name,
      overview: data.overview,
      backdrop: data.backdrop_path,
      date: data.first_air_date,
      rank: data.vote_average,
      id:data.id
    })
  }

  private makeSeries(data: any): Array<Serie> {
    return data.results.map((r) => this.makeSerie(r))
  }
}

export default new SerieRepository()