import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Producer from 'App/Services/Kafka/Producer'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.all()
    data.password = await Hash.make(data.password)
    const producer = new Producer()
    producer.produce({
      topic: 'newClient',
      messages: [{ value: JSON.stringify(data) }],
    })
    response.send(data)
  }
}
