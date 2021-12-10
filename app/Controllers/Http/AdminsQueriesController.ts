import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transfer from 'App/Models/Transfer'
import AxiosClients from 'App/Services/Axios/AxiosClients'

export default class AdminsQueriesController {
  public async queryByCpf({ request, response }: HttpContextContract) {
    const { cpf } = request.params()
    try {
      const { data: user } = await new AxiosClients().get('cpf_number', cpf)
      if (!user) {
        return response.notFound({ error: { message: 'Cliente não encontrado.' } })
      }
      delete user.password
      delete user.token
      delete user.tokenCreatedAt

      const transfers = await Transfer.query()
        .select('sender_cpf', 'beneficiary_cpf', 'value', 'createdAt')
        .where((transfer) => {
          transfer.where('sender_cpf', user.cpf_number)
          transfer.orWhere('beneficiary_cpf', user.cpf_number)
        })

      let sent: number = 0
      let received: number = 0

      transfers.forEach((transfer) => {
        transfer.sender_cpf === cpf
          ? (sent += Number(transfer.value))
          : (received += Number(transfer.value))
      })

      return { ...user, sent, received, balance: received - sent, transfers }
    } catch (err) {
      return response.internalServerError({
        error: { message: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      })
    }
  }

  public async queryByStatus({ request, response }: HttpContextContract) {
    const { status } = request.params()
    try {
      const { data: users } = await new AxiosClients().get('status', status)
      if (!users.length) {
        return response.notFound({ error: { message: 'Nenhum cliente encontrado.' } })
      }
      delete users.password
      delete users.token
      delete users.tokenCreatedAt

      return { ...users }
    } catch (err) {
      return response.internalServerError({
        error: { message: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      })
    }
  }
}
