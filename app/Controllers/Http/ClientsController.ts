import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Producer from 'App/Services/Kafka/Producer'
import Hash from '@ioc:Adonis/Core/Hash'
import AxiosClients from 'App/Services/Axios/AxiosClients'
import StoreValidator from 'App/Validators/Clients/StoreValidator'

export default class ClientsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)
    try {
      const data = request.all()
      data.password = await Hash.make(data.password)
      const producer = new Producer()
      producer.produce({
        topic: 'newClient',
        messages: [{ value: JSON.stringify(data) }],
      })
      response.send(
        'Sua requisição foi enviada com sucesso, fique atento ao seu e-mail e em breve enviaremos um feedback.'
      )
    } catch (err) {
      return response.internalServerError({
        error: { message: 'Oops, aconteceu um erro interno, tente novamente mais tarde.' },
      })
    }
  }

  public async index({ params }: HttpContextContract) {
    const { cpf } = params.client
    const { data: user } = await new AxiosClients().get('cpf_number', cpf)
    return user
  }

  public async update({ request, params, response }: HttpContextContract) {
    const { cpf } = request.params()
    if (cpf !== params.client.cpf) {
      return response.forbidden({
        error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
      })
    }
    const userData = request.only(['password', 'address', 'city', 'state', 'zipcode'])
    if (userData.password) {
      userData.password = await Hash.make(userData.password)
    }

    await new AxiosClients().put(cpf, userData)
    return userData
  }
}
