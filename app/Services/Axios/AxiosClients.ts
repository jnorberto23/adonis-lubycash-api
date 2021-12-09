import axios from 'axios'

export default class AxiosClients {
  public async get(cpf: string) {
    try {
      const client = await axios.get(`${process.env.MS_URL}/users/${cpf}`)
      return client
    } catch (err) {
      return err
    }
  }
  public async put(cpf: string, current_balance: number) {
    try {
      const client = await axios.put(`${process.env.MS_URL}/users/${cpf}`, { current_balance })
      return client
    } catch (err) {
      return err
    }
  }
}
