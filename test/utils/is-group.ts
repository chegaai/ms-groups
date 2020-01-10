import { expect } from 'chai'

export function isGroup (data: unknown) {
  expect(data).to.have.property('id')
  expect(data).to.have.property('name')
  expect(data).to.have.property('description')
  expect(data).to.have.property('founder')
  expect(data).to.have.property('organizers')
  expect(data).to.have.property('followers')
  expect(data).to.have.property('slug')
  expect(data).to.have.property('pictures')
  expect(data).to.have.property('socialNetworks')
  expect(data).to.have.property('tags')
  expect(data).to.have.property('location')
  expect(data).to.have.property('deletedAt')
  expect(data).to.have.property('updatedAt')
  expect(data).to.have.property('createdAt')
}
