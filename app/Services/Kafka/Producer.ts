import { Kafka, Producer as KafkaProducer, Message } from 'kafkajs'

interface InterfaceProduce {
  topic: string
  messages: Message[]
}

export default class Producer {
  private producer: KafkaProducer

  constructor() {
    const kafka = new Kafka({
      clientId: 'mailer-producer',
      brokers: ['kafka:29092'],
    })

    this.producer = kafka.producer()
  }

  public async produce({ topic, messages }: InterfaceProduce) {
    await this.producer.connect()
    await this.producer.send({
      topic,
      messages,
    })
    await this.producer.disconnect()
  }
}
