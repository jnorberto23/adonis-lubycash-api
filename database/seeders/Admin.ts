import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    await Admin.createMany([
      {
        fullName: 'João Victor Machado Norberto',
        email: 'joaovictor@outlook.com',
        password: 'root',
      },
      {
        fullName: 'Adonis da Silva',
        email: 'adonis.silva@outlook.com',
        password: 'admin',
      },
    ])
  }
}
