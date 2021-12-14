import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transfer from 'App/Models/Transfer'
import AxiosClients from 'App/Services/Axios/AxiosClients'

export default class AdminsQueriesController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const query = request.parsedUrl.query
      if (!request.qs().cpf_number && !request.qs().status && query) {
        return response.badRequest({
          error: {
            message: 'Parametro não encontrado. Parametros disponiveis: ?cpf_number | ?status',
          },
        })
      }
      const { data: users } = await new AxiosClients().get(query!)

      if (!users.length) {
        return response.notFound({ error: { message: 'Nenhum cliente encontrado.' } })
      }

      if (request.qs().cpf_number) {
        const transfers = await Transfer.query()
          .select('sender_cpf', 'beneficiary_cpf', 'value', 'createdAt')
          .where((transfer) => {
            transfer.where('sender_cpf', request.qs().cpf_number)
            transfer.orWhere('beneficiary_cpf', request.qs().cpf_number)
          })

        let sent: number = 0
        let received: number = 0
        transfers.forEach((transfer) => {
          transfer.sender_cpf === request.qs().cpf_number
            ? (sent += Number(transfer.value))
            : (received += Number(transfer.value))
        })

        return { ...users[0], sent, received, balance: received - sent, transfers }
      } else {
        return { ...users }
      }
    } catch (err) {
      return response.internalServerError({
        error: { message: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      })
    }
  }
}
