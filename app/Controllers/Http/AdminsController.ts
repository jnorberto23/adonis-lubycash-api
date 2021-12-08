import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import StoreValidator from 'App/Validators/Admins/StoreValidator'

export default class AdminsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const admins = await Admin.query().select('id', 'full_name', 'email')
      return admins
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao listar os usuários admins' } })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)
    try {
      const data = request.all()
      const admin = await Admin.create(data)
      return admin
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao criar o usuario admin' } })
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      if (Number(auth.user!.id) !== Number(params.id)) {
        return response.forbidden({
          error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
        })
      }

      const admin = await Admin.find(params.id)
      if (!admin) {
        return response.notFound({
          error: { message: 'Oops, esse usuário não existe ou foi apagado' },
        })
      }
      return {
        id: admin.id,
        name: admin.fullName,
        email: admin.email,
        createdAt: admin.createdAt,
      }
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu ao buscar os seus dados' } })
    }
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    if (Number(auth.user!.id) !== Number(params.id)) {
      return response.forbidden({
        error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
      })
    }
    const admin = await Admin.find(params.id)
    if (!admin) {
      return response.notFound({
        error: { message: 'Oops, esse usuario não existe ou foi apagado' },
      })
    }
    const data = request.only(['full_name', 'password'])
    admin.merge(data)
    await admin.save()
    return admin
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      if (Number(auth.user!.id) !== Number(params.id)) {
        return response.forbidden({
          error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
        })
      }
      const admin = await Admin.find(params.id)
      if (!admin) {
        return response.notFound({
          error: { message: 'Oops, esse usuario não existe ou já foi apagado' },
        })
      }
      await admin.delete()
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu ao apagar os seus dados' } })
    }
  }
}
