interface ReviewsInterface {
  author: Array<string>
  content: string
  created_at: Date
}

export class Reviews {
  public author: Array<string>
  public content: string
  public created_at: Date

  constructor(reviews: ReviewsInterface) {
    this.author = reviews.author
    this.content = reviews.content
    this.created_at = reviews.created_at
  }
}
