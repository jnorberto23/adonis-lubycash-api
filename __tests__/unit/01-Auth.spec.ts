import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authentication', () => {
  test('LOGIN - must login successfully and return a token', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login/admin')
      .send({
        email: 'joaovictor@outlook.com',
        password: 'root',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.token)
  })

  test('LOGIN - should return an error if the password is incorrect', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login/admin')
      .send({
        email: 'joaovictor@outlook.com',
        password: 'rootaaa',
      })
      .expect(400)
    assert.equal(response.status, 400)
    assert.exists(response.body.errors[0].message)
  })

  test('LOGIN - should return an error if the email does not exist', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login/admin')
      .send({
        email: 'joao@skke.com',
        password: 'root',
      })
      .expect(422)
    assert.equal(response.status, 422)
    assert.exists(response.body.errors[0].rule)
    assert.exists(response.body.errors[0].field)
    assert.exists(response.body.errors[0].message)
  })
})
