import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class SocialAuthController {
  //redirect
  public async redirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }
  //callback
  public async callback({ ally, auth, response }: HttpContextContract) {
    const google = ally.use('google')
    //se l'accesso è negato
    if (google.accessDenied()) {
      return 'accesso negato'
    }
    //se non verifica il csrf
    if (google.stateMisMatch()) {
      return 'richiesta scaduta, riprova!'
    }
    //se ho un qualsiasi tipo di errore
    if (google.hasError()) {
      return google.getError()
    }
    //se tutto va a buon fine autentico l'utente
    const googleUser = await google.user()
    //ricerco l'utente per email e se non lo trovo lo creo
    const user = await User.firstOrCreate(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        //chiedere info a riguardo
        password: googleUser.original.given_name,
        username: googleUser.name,
        accessToken: googleUser.token.token,
        isVerified: googleUser.emailVerificationState === 'verified',
      }
    )
    await auth.use('web').login(user)
    return response.redirect('/')
  }
}
