interface MovieInterface {
  title: string
  overview: string
  backdrop: string
  date: Date
  rank: Number
  id: Number
  homepage?: string
  genres?: Array<string>
}

export class Movie {
  public title: string
  public overview: string
  public backdrop: string
  public date: Date
  public rank: Number
  public id: Number
  public homepage?: string
  public genres?: Array<string>


  constructor(movie: MovieInterface) {
    this.title = movie.title
    this.overview = movie.overview
    this.backdrop = movie.backdrop
    this.date = movie.date
    this.rank = movie.rank
    this.id = movie.id
    this.homepage = movie.homepage
    this.genres = movie.genres
  }

}