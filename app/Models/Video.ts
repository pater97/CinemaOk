interface VideoInterface {
  key: any
}

export class Video {
  public key: any

  constructor(video: VideoInterface) {
    this.key = video.key
  }
}
