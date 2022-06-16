import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

    //signup
    public async index({ view }: HttpContextContract) {
        return await view.render('user/signup')
      }
    
}
