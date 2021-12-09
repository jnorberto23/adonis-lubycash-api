import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Producer from 'App/Services/Kafka/Producer'
import Hash from '@ioc:Adonis/Core/Hash'
import AxiosClients from 'App/Services/Axios/AxiosClients'

export default class ClientsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.all()
    const { data: user } = await new AxiosClients().get(data.cpf_number)

    if (user) {
      return response.forbidden({
        error: { message: 'Oops, esse CPF já está cadastrado como nosso cliente.' },
      })
    }
    data.password = await Hash.make(data.password)
    const producer = new Producer()
    producer.produce({
      topic: 'newClient',
      messages: [{ value: JSON.stringify(data) }],
    })
    response.send(data)
  }

  public async index({ params }: HttpContextContract) {
    const { cpf } = params.client
    const { data: user } = await new AxiosClients().get(cpf)
    return user
  }

  public async update({ request, params, response }: HttpContextContract) {
    const { cpf } = request.params()
    if (cpf !== params.client.cpf) {
      return response.forbidden({
        error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
      })
    }
    const userData = request.only(['phone', 'password', 'address', 'city', 'state', 'zipcode'])
    await new AxiosClients().put(cpf, userData)
    return userData
  }
}