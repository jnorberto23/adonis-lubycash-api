import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Admins CRUD', () => {
  // INDEX
  test('INDEX - should return an error if an invalid token is passed as a parameter', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins')
      .auth('123', { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
  })

  test('INDEX - must return all users if a valid token is passed as a parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/admins')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
  })

  // SHOW
  test('SHOW - must return a user if the requesters id is equal to the id passed as parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get(`/admins/1`)
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
  })

  test('SHOW - should return an error if the requesters id is different from the id passed as parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get(`/admins/2`)
      .auth(token, { type: 'bearer' })
      .send()
      .expect(403)
    assert.equal(response.status, 403)
  })
  // STORE
  test('STORE - should return an error if any field is empty', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/admins')
      .auth(token, { type: 'bearer' })
      .send({
        full_name: 'Rafaela Norberto',
        email: 'rafaela@gmail.com',
        password: '',
      })
      .expect(422)
    assert.equal(response.status, 422)
    assert.exists(response.body.errors[0].rule)
    assert.exists(response.body.errors[0].field)
    assert.exists(response.body.errors[0].message)
  })

  test('STORE - must register the user if no field is empty', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token
    const response = await supertest(BASE_URL)
      .post('/admins')
      .auth(token, { type: 'bearer' })
      .send({
        full_name: 'Rafaela Norberto',
        email: 'rafaelaj@gmail.com',
        password: '123456',
      })
      .expect(200)
    assert.equal(response.status, 200)
  })

  // UPDATE
  test('UPDATE - should return an error if there is an attempt to update from a non-existent user', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaoskke@outlook.com',
      password: 'root',
    })
    const token = user.body.token
    const response = await supertest(BASE_URL)
      .post('/admins/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(404)
    assert.equal(response.status, 404)
  })

  test('UPDATE - should return an error if the requesting user is different from the target user', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/admins/2')
      .auth(token, { type: 'bearer' })
      .send({
        full_name: 'Adonis Creed',
        password: 'Aloha',
      })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('UPDATE - must update the data if the requester id is the same as the target id', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/admins/1')
      .auth(token, { type: 'bearer' })
      .send({
        full_name: 'Adonis Creed',
        password: 'root',
      })
      .expect(200)
    assert.equal(response.status, 200)
  })
  // DESTROY
  test('DESTROY - should return an error if the target user does not exist', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/admins/1')
      .auth(token, { type: 'bearer' })
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('DESTROY - should return an error if the requester id is different from the target id', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/admins/2')
      .auth(token, { type: 'bearer' })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('DESTROY - must delete a user if the requester id is the same as the target', async (assert) => {
    const user = await supertest(BASE_URL).post('/admins/login').send({
      email: 'joaovictor@outlook.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/admins/1')
      .auth(token, { type: 'bearer' })
      .expect(200)
    assert.equal(response.status, 200)
  })
})
