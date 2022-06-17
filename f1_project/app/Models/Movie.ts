interface MovieInterface {
  title: string
  overview: string
  backdrop: string
  date: Date
  rank: Number
  id: Number
}

export class Movie {
  public title: string
  public overview: string
  public backdrop: string
  public date: Date
  public rank: Number
  public id: Number


  constructor(movie: MovieInterface) {
    this.title = movie.title
    this.overview = movie.overview
    this.backdrop = movie.backdrop
    this.date = movie.date
    this.rank = movie.rank
    this.id = movie.id
  }

}