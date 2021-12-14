import Producer from 'App/Services/Kafka/Producer'

export default class MailDelivery {
  public async send(user, messageParams: {}, topic: string, subject: string) {
    const message = {
      user: user,
      subject: subject,
      message: messageParams,
    }
    const producer = new Producer()
    try {
      producer.produce({ topic: topic.toString(), messages: [{ value: JSON.stringify(message) }] })
      return true
    } catch (err) {
      return err
    }
  }
}
