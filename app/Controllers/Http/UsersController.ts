import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Producer from 'App/Services/Kafka/Producer'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.all()
    const producer = new Producer()
    producer.produce({
      topic: 'newClient',
      messages: [{ value: JSON.stringify(data) }],
    })
    response.send(data)
  }
}
