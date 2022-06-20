//importo il modello movie fatto in precedenza
import { Serie } from 'App/Models/Serie'
//importo il modello video
import { Video } from 'App/Models/Video'
//importo modello recensioni
import { Reviews } from 'App/Models/Reviews'
//importo api helper ovvero uno schema per le richieste api
import ApiHelper from 'App/Helpers/ApiHelper'
//importo env dove avrò la chiave per le richieste api
import Env from '@ioc:Adonis/Core/Env'

class SerieRepository {
  //metto in una variabile l'url base così da non ripeterlo
  private baseUrl = 'https://api.themoviedb.org/3'
  //eseguo chiamata axios x popolari
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
   //eseguo chiamata axios x meglio votate
   public async top(): Promise<Array<Serie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/tv/top_rated`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeTopSeries(response)
  }
  //eseguo chiamata axios x serie in onda
  public async onAir(): Promise<Array<Serie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/tv/on_the_air`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeOnairSeries(response)
  }
  //eseguo chiamata axios x serie tv simili
  public async similar(id:number): Promise<Array<Serie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/tv/${id}/similar`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeSimilarSeries(response)
  }
  //dettagli singola serie
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
  //chiamo la lista dei trailer per id del film
  public async VideoTrailer(id: number): Promise<Array<Video>> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/tv/${id}/videos`,
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
      url: `${this.baseUrl}/tv/${id}/reviews`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'en-US',
      },
    })
    return this.reviews(response)
  }

  private makeSerie(data: any): Serie {
    return new Serie({
      name: data.name,
      overview: data.overview,
      backdrop: data.backdrop_path,
      date: data.first_air_date,
      rank: data.vote_average,
      id:data.id,
      homepage:data.homepage,
      genres:data.genres,
      seasons: data.seasons
    })
  }
    //costrutto del trailer
    private makeKeyTrailer(data:any):Video {
      return new Video({
        key:data.key
      })
    }
  //costrutto delle recensioni
  private makeReviews(data:any):Reviews {
    return new Reviews({
      author:data.author_details,
      content:data.content,
      created_at:data.created_at
    })
  }
  //serie popolari 
  private makeSeries(data: any): Array<Serie> {
    return data.results.map((r) => this.makeSerie(r))
  }
  //top rated
  private makeTopSeries(data: any): Array<Serie> {
    return data.results.map((r) => this.makeSerie(r))
  }
   //in onda attualmente
   private makeOnairSeries(data: any): Array<Serie> {
    return data.results.map((r) => this.makeSerie(r))
  }
   //serie tv simili
   private makeSimilarSeries(data: any): Array<Serie> {
    return data.results.map((r) => this.makeSerie(r))
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

export default new SerieRepository()