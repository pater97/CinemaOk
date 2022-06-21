import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class UsersController {

  public async index({ view }: HttpContextContract) {
    const users = await User.all()
    return view.render('admin/index',{users})
  }


  //mostra il from di creazione nuovo utente
  public async showCreate({view}:HttpContextContract){
    return view.render('admin/create')
  }


  //salva il contenuto del form
  public async store({request,response}:HttpContextContract){
     //estrapolo output admin
     const isAdminInput = request.input('is_admin')
     //definisco la variabile
     let is_admin = false
     //se la chiave è uguale lo abilito ad admin
     if(isAdminInput === 'sonoadmin'){
        is_admin = true
     }
     // creo lo schema di validazione
     const userSchema = schema.create({
       //valido
       username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
       email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
       password: schema.string({}, [rules.minLength(8)])
     })
     //eseguo la validazione e nel caso fallisse sarò riportato alla pagina di registrazione
     const data = await request.validate({ schema: userSchema }) 
     //aggiungo ai dati validati anche la caratteristica admin
     data["is_admin"] = is_admin
     //creo un nuovo record con i dati validati
     await User.create(data)
     //rendirizzo alla home page
     return response.redirect('/admin')
  }

  //modifica dell'utente
  public async edit({view,params}:HttpContextContract){
    //passo l'utente per sapere quale modificare e per inserire i valori
    const user = await User.findOrFail(params.id)
    return view.render('admin/update',{user})
  }

  //store dell'update
  public async update({request,response}:HttpContextContract){
    const id = request.input('id')
    const user = await User.findOrFail(id)
    //estrapolo output admin
    const isAdminInput = request.input('is_admin')
    //definisco la variabile
    let is_admin = false
    //se la chiave è uguale lo abilito ad admin
    if(isAdminInput === 'sonoadmin'){
       is_admin = true
    }
     // creo lo schema di validazione
     const userSchema = schema.create({
      //valido
      username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
      email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
      password: schema.string({}, [rules.minLength(8)])
    })
    //eseguo la validazione e nel caso fallisse sarò riportato alla pagina di registrazione
    const data = await request.validate({ schema: userSchema }) 
    //aggiungo ai dati validati anche la caratteristica admin
    data["is_admin"] = is_admin
    //unisco i nuovi valori
    user.merge(data)
    //creo un nuovo record con i dati validati
    await user.save()
    //rendirizzo alla home page
    return response.redirect('/admin')
  }
  //eliminare utente
  public async destroy({response,request}:HttpContextContract){
    const id = request.input('id')
    const user = await User.findOrFail(id)
    user.delete()
    return response.redirect('/admin')
  }
}
