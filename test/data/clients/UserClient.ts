// import { expect } from 'chai'
// import { ObjectId } from 'mongodb'
import axios, { AxiosInstance } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

describe('ms-group client', () => {
  let mock: AxiosMockAdapter
  let http: AxiosInstance

  before(() => {
    http = axios.create()
    mock = new AxiosMockAdapter(http)
  })

  after(() => {
    mock.restore()
  })

  afterEach(() => {
    mock.reset()
  })
})
