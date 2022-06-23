import LucidRepository from 'App/Repositories/Abstract/LucidRepository'
import User from 'App/Models/User'

/**
 * This class handles operations performed on User entities.
 *
 * @class
 * @category Repository
 * @extends LucidRepository
 * @hideconstructor
 */
class UserRepository extends LucidRepository<typeof User> {
  constructor() {
    super(User)
  }
}

export default new UserRepository()
