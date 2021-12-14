import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import AxiosClients from 'App/Services/Axios/AxiosClients'
import crypto from 'crypto'
import moment from 'moment'
import StoreValidator from 'App/Validators/Clients/ForgotPassword/StoreValidator'
import UpdateValidator from 'App/Validators/Clients/ForgotPassword/UpdateValidator'
import MailDelivery from 'App/Services/Kafka/MailDelivery'

export default class ForgotPasswordClientsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)
    try {
      const cpf = request.input('cpf')

      const { data: user } = await new AxiosClients().get(`cpf_number=${cpf}`)

      if (!user.length) {
        return response.badRequest({
          error: { message: 'Algo não deu certo, o cpf está correto?' },
        })
      }
      user[0].token = crypto.randomBytes(10).toString('hex')
      await new AxiosClients().put(user[0].cpf_number, {
        token: user[0].token,
        token_created_at: new Date(),
      })
      const link = `${request.input('redirect_url')}?token=${user[0].token}`
      await new MailDelivery().send(user[0], { link }, 'forgotPassword', 'Recuperação de senha')
      return response.ok({
        message:
          'Sua requisição de recuperação de senha foi enviada com sucesso. Por favor, verifique seu e-mail.',
      })
    } catch (err) {
      return response.internalServerError({
        error: { message: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      })
    }
  }

  public async update({ request, response }) {
    await request.validate(UpdateValidator)
    try {
      const { token, password } = request.all()

      const { data: user } = await new AxiosClients().get(`token=${token}`)

      if (!user.length) {
        return response.badRequest({
          error: { message: 'Algo não deu certo, o token está correto?' },
        })
      }

      const tokenExpired = moment().subtract('2', 'days').isAfter(user[0].tokenCreatedAt)

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Ops, o token de recupeção está expirado, pois já se passaram 48 horas.',
          },
        })
      }

      await new AxiosClients().put(user[0].cpf_number, {
        token: null,
        token_created_at: null,
        password: await Hash.make(password),
      })

      return response.ok({
        message: 'Sua senha foi alterada com sucesso',
      })

    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Ops, algo deu errado ao tentar resetar sua senha :(' } })
    }
  }
}
