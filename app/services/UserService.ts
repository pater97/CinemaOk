import UserRepository from 'App/Repositories/UserRepository'
import BaseService from 'App/Services/Abstract/BaseService'
import User from 'App/Models/User'

/**
 * This service manages the operations performed on the User model.
 *
 * @class
 * @category Service
 * @extends BaseService
 * @hideconstructor
 */
class UserService extends BaseService<typeof User> {
  constructor() {
    super(UserRepository)
  }
}

export default new UserService()
