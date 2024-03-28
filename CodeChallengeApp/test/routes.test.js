const request = require('supertest')
const app = require('../app')
const fs = require('fs').promises
const path = require('path')
let chai = null
import('chai').then(chaiModule => {
    chai = chaiModule
})

async function readUserData(userId) {
    const datasetPath = path.join(__dirname, '/../dataset.json')
    const data = await fs.readFile(datasetPath)
    const users = JSON.parse(data)
    const user = users.find(u => u.id === userId)
    return user
}

describe('App Routes', () => {
    it('GET /users should return 200 and list of users', async () => {
        const res = await request(app).get('/users')
        chai.expect(res.status).to.equal(200)
    })

    it('GET /create should return 201 and an user creation form', async () => {
        const res = await request(app).get('/users/create')
        chai.expect(res.status).to.equal(201)
    })

    it('POST /create should return 302 and create a new user', async () => {
        const user = {
            name: 'Fabio Cunha',
            id: 'ADGFDEW323223DFA',
            language: 'Portuguese',
            bio: 'Test',
            version: 1.0
        }
        const res = await request(app).post('/users/create').send(user)
        chai.expect(res.status).to.equal(302)
        const newUser = await readUserData(user.id)
        chai.expect(user).to.deep.equal(newUser)
    })

    it('POST /create should return 400 and error page', async () => {
        const user = {
            name: 'a',
            id: '123',
            language: 'Portuguese',
            bio: 'Test',
            version: '11'
        }
        const res = await request(app).post('/users/create').send(user)
        chai.expect(res.status).to.equal(400)
    })

    it('GET /edit/:userId should return 202 and user edit form if user exists', async () => {
        const userId = 'ADGFDEW323223DFA'
        const res = await request(app).get(`/users/edit/${userId}`)
        chai.expect(res.status).to.equal(202)
      })

    it('GET /edit/:userId should return 404 and error page if user does not exist', async () => {
        const userId = '1111111111111111'
        const res = await request(app).get(`/users/edit/${userId}`)
        chai.expect(res.status).to.equal(404)
    })

    it('PUT /edit/:userId should return 203 and update user info', async () => {
        const newUserData = {
            name: 'Juan Fabio Cunha',
            id: 'ADGFDEW323223DFA',
            language: 'Spanish',
            bio: 'Updated Bio Test',
            version: 2.0
        }
        const res = await request(app).put(`/users/edit/${newUserData.id}`).send(newUserData)
        chai.expect(res.status).to.equal(203)
        const updatedUser = await readUserData(newUserData.id)
        chai.expect(updatedUser).to.deep.equal(newUserData)
    })

    it('PUT /edit/:userId should return 400 and error page', async () => {
        const newUserData = {
            name: 'a',
            id: 'ADGFDEW323223DFA',
            language: 'Spanish',
            bio: 'Updated Bio Test',
            version: '11a'
        }
        const res = await request(app).put(`/users/edit/${newUserData.id}`).send(newUserData)
        chai.expect(res.status).to.equal(400)
    })

    it('DELETE /delete/:userId should return 204 and delete the user if user exists', async () => {
        const userId = 'ADGFDEW323223DFA'
        const res = await request(app).delete(`/users/delete/${userId}`)
        chai.expect(res.status).to.equal(204)
        const ver = await request(app).get(`/${userId}`)
        chai.expect(ver.status).to.equal(404)
    })

    it('DELETE /delete/:userId should return 404 and error page', async () => {
        const userId = '1111111111111111'
        const res = await request(app).delete(`/users/delete/${userId}`)
        chai.expect(res.status).to.equal(404)
    })

    it('GET /:userId should return 205 and user details if user exists', async () => {
        const userId = '6VTI8X6LL0MMPJCC'
        const res = await request(app).get(`/users/${userId}`)
        chai.expect(res.status).to.equal(205)
    })

    it('GET /:userId should return 404 and error page if user does not exist', async () => {
        const userId = '1111111111111111'
        const res = await request(app).get(`/users/${userId}`)
        chai.expect(res.status).to.equal(404)
    })
})