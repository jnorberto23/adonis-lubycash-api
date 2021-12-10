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

validator.rule(
  'cpf', // rule name
  async (value, _, options) => {
    const { data: user } = await new AxiosClients().get('cpf_number', value)
    if (user !== undefined) {
      options.errorReporter.report(
        options.pointer,
        'cpf.unique',
        'CPF já existe e precisa ser único.',
        options.arrayExpressionPointer
      )
    }
  }, // validation callback
  () => {
    return {
      async: true,
      compiledOptions: {},
    }
  }
)

validator.rule(
  'phone', // rule name
  async (value, _, options) => {
    const { data: user } = await new AxiosClients().get('phone', value)
    if (user !== undefined) {
      options.errorReporter.report(
        options.pointer,
        'phone.unique',
        'Phone já existe e precisa ser único.',
        options.arrayExpressionPointer
      )
    }
  }, // validation callback
  () => {
    return {
      async: true,
      compiledOptions: {},
    }
  }
)

validator.rule(
  'emailUnique', // rule name
  async (value, _, options) => {
    const { data: user } = await new AxiosClients().get('email', value)
    if (user !== undefined) {
      options.errorReporter.report(
        options.pointer,
        'email.unique',
        'Email já existe e precisa ser único.',
        options.arrayExpressionPointer
      )
    }
  }, // validation callback
  () => {
    return {
      async: true,
      compiledOptions: {},
    }
  }
)
