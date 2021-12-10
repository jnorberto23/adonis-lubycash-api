import axios from 'axios'

export default class AxiosClients {
  public async get(key, value) {
    try {
      const client = await axios.get(`${process.env.MS_URL}/users?${key}=${value}`)
      return client
    } catch (err) {
      return err
    }
  }
  public async put(cpf: string, data: any) {
    try {
      const client = await axios.put(`${process.env.MS_URL}/users/${cpf}`, { data })
      return client
    } catch (err) {
      return err
    }
  }
}
