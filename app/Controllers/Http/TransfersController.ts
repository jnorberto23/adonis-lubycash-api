import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AxiosClients from 'App/Services/Axios/AxiosClients'

export default class TransfersController {
  public async index({}: HttpContextContract) {
    return 'index'
  }

  public async show({}: HttpContextContract) {
    return 'show'
  }
  public async store({ response, params, request }: HttpContextContract) {
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

      const { data: senderUser } = await new AxiosClients().get(senderCpf)
      const { data: beneficiaryUser } = await new AxiosClients().get(beneficiaryCpf)

      if (!beneficiaryUser || beneficiaryUser.status === 'refused') {
        return response.badRequest({
          error: {
            message: `O CPF informado não existe ou não é cliente ativo do LubyCash`,
          },
        })
      }

      if (senderUser.current_balance < value) {
        return response.badRequest({
          error: {
            message: `Saldo insuficiente para efetuar a transferência. Saldo atual: ${senderUser.current_balance}`,
          },
        })
      }

      await new AxiosClients().put(beneficiaryCpf, beneficiaryUser.current_balance + value)
      await new AxiosClients().put(senderCpf, senderUser.current_balance - value)

      return `Pix realizado com sucesso.`
    } catch (err) {
      return err
    }
  }
}
