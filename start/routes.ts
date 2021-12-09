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

Route.group(() => {
  Route.resource('admins', 'AdminsController').except(['create', 'edit'])
}).middleware('adminAuth')

Route.post('/clients', 'UsersController.store')
Route.group(() => {
  Route.get('/clients', 'UsersController.show')
}).middleware('clientAuth')

Route.group(() => {
  //Route.resource('transfers', 'TransfersController').only(['store', 'show', 'index'])
  Route.get('/transfers/:from/:to?', 'TransfersController.show')
}).middleware('clientAuth')
