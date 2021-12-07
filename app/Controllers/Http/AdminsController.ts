import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'

export default class AdminsController {
  public async index({ response }: HttpContextContract) {
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

  public async show({ params, response }: HttpContextContract) {
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
  }

  public async update({ params, request, response }: HttpContextContract) {
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

  public async destroy({ params, response }: HttpContextContract) {
    const admin = await Admin.find(params.id)
    if (!admin) {
      return response.notFound({
        error: { message: 'Oops, esse usuario não existe ou já foi apagado' },
      })
    }
    await admin.delete()
  }
}
