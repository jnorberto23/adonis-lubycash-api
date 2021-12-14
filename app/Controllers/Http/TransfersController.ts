import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transfer from 'App/Models/Transfer'
import AxiosClients from 'App/Services/Axios/AxiosClients'
import MailDelivery from 'App/Services/Kafka/MailDelivery'
import StoreValidator from 'App/Validators/Clients/Transfers/StoreValidator'

export default class TransfersController {
  public async index({ params, response }: HttpContextContract) {
    try {
      const { cpf } = params.client
      const transfers = await Transfer.query()
        .where('sender_cpf', cpf)
        .orWhere('beneficiary_cpf', cpf)
        .select('sender_cpf', 'beneficiary_cpf', 'value', 'createdAt')

      let sent: number = 0
      let received: number = 0

      transfers.forEach((transfer) => {
        transfer.sender_cpf === cpf
          ? (sent += Number(transfer.value))
          : (received += Number(transfer.value))
      })

      return { ...params.client, sent, received, balance: received - sent, transfers }
    } catch (err) {
      return response.internalServerError({
        error: {
          message: 'Ocorreu um erro interno ao listar o seu extrato, tente novamente mais tarde.',
        },
      })
    }
  }

  public async show({ params, response, request }: HttpContextContract) {
    try {
      const { from, to } = request.params()
      const { cpf } = params.client

      const transfers = await Transfer.query()
        .select('sender_cpf', 'beneficiary_cpf', 'value', 'createdAt')
        .where((transfer) => {
          if (from) transfer.where('createdAt', '>=', from)
          if (to) transfer.andWhere('createdAt', '<=', `${to}T23:59:59`)
        })
        .andWhere((transfer) => {
          transfer.where('sender_cpf', cpf)
          transfer.orWhere('beneficiary_cpf', cpf)
        })

      let sent: number = 0
      let received: number = 0

      transfers.forEach((transfer) => {
        transfer.sender_cpf === cpf
          ? (sent += Number(transfer.value))
          : (received += Number(transfer.value))
      })

      return { ...params.client, sent, received, balance: received - sent, transfers }
    } catch (err) {
      return response.internalServerError({
        error: {
          message: 'Ocorreu um erro interno ao listar o seu extrato, tente novamente mais tarde.',
        },
      })
    }
  }

  public async store({ response, params, request }: HttpContextContract) {
    await request.validate(StoreValidator)
    const { cpf: senderCpf } = params.client
    const { beneficiary_cpf: beneficiaryCpf, value } = request.all()

    try {
      if (senderCpf === beneficiaryCpf) {
        return response.badRequest({
          error: {
            message: `Não é possivel enviar um pix a si mesmo.`,
          },
        })
      }

      const { data: senderUser } = await new AxiosClients().get(`cpf_number=${senderCpf}`)
      const { data: beneficiaryUser } = await new AxiosClients().get(`cpf_number=${beneficiaryCpf}`)

      if (!beneficiaryUser[0] || beneficiaryUser[0].status === 'refused') {
        return response.badRequest({
          error: {
            message: `O CPF informado não existe ou não é cliente ativo do LubyCash`,
          },
        })
      }

      if (senderUser[0].current_balance < value) {
        return response.badRequest({
          error: {
            message: `Saldo insuficiente para efetuar a transferência. Saldo atual: ${senderUser[0].current_balance}`,
          },
        })
      }

      await new AxiosClients().put(beneficiaryCpf, {
        current_balance: beneficiaryUser[0].current_balance + value,
      })
      await new AxiosClients().put(senderCpf, {
        current_balance: senderUser[0].current_balance - value,
      })

      await Transfer.create({ sender_cpf: senderCpf, beneficiary_cpf: beneficiaryCpf, value })

      await new MailDelivery().send(
        senderUser,
        { receiver: beneficiaryUser[0], value },
        'newTransferSend',
        'Transferência realizada com sucesso!'
      )

      await new MailDelivery().send(
        beneficiaryUser,
        { sender: senderUser[0], value },
        'newTransferReceived',
        'Você recebeu uma transferência!'
      )

      return `Pix realizado com sucesso.`
    } catch (err) {
      return err
    }
  }
}
