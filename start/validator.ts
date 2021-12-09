/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'
import AxiosClients from 'App/Services/Axios/AxiosClients'

validator.rule('cpfExists', async (value, _, options) => {
  if (typeof value !== 'string') return

  const { data: user } = await new AxiosClients().get(value)

  if (user) {
    options.errorReporter.report(
      options.pointer,
      'cpfExists',
      'CPF validation failed',
      options.arrayExpressionPointer
    )
  }
})
