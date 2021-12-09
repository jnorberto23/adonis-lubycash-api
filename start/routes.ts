/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'worlds' }
})

//Login
Route.group(() => {
  Route.post('/admin', 'AuthController.adminLogin')
  Route.post('/client', 'AuthController.clientLogin')
}).prefix('login')

//Public Route
Route.post('/clients', 'ClientsController.store')

Route.group(() => {
  //Transfers
  Route.get('/transfers', 'TransfersController.index')
  Route.get('/transfers/:from/:to?', 'TransfersController.show')
  Route.post('/transfers', 'TransfersController.store')

  //Clients
  Route.put('/clients/:cpf', 'ClientsController.update')
  Route.get('/clients', 'ClientsController.index')
}).middleware('clientAuth')

Route.group(() => {
  Route.resource('admins', 'AdminsController').except(['create', 'edit'])
}).middleware('adminAuth')
