import NodeCache from 'node-cache'

export default class CacheHelper {
  protected cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  public get(key: string | number) {
    return this.cache.get(key)
  }

  public set(key: string | number, value: any) {
    return this.cache.set(key, value)
  }

  public has(key: string | number): boolean {
    return this.cache.has(key)
  }

  public del(key: string | number) {
    return this.cache.del(key)
  }
}
