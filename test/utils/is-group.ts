import { expect } from 'chai'
import { AxiosResponse } from 'axios'

export function isGroup (response: AxiosResponse) {
  expect(response.data).to.have.property('id')
  expect(response.data).to.have.property('name')
  expect(response.data).to.have.property('description')
  expect(response.data).to.have.property('founder')
  expect(response.data).to.have.property('organizers')
  expect(response.data).to.have.property('followers')
  expect(response.data).to.have.property('slug')
  expect(response.data).to.have.property('pictures')
  expect(response.data).to.have.property('socialNetworks')
  expect(response.data).to.have.property('tags')
  expect(response.data).to.have.property('location')
  expect(response.data).to.have.property('deletedAt')
  expect(response.data).to.have.property('updatedAt')
  expect(response.data).to.have.property('createdAt')
}
