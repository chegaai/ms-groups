import { expect } from 'chai'
import { ObjectId } from 'mongodb'
import { validGroup, VALID_GROUP_OBJECT_ID } from '../mocks/groups'
import sinon, { SinonStubbedInstance } from 'sinon'
import { GroupRepository } from '../../src/data/repositories/GroupRepository'
import { GroupService } from '../../src/services/GroupService'
import { factory as userClientFactory } from '../mocks/userClient'
import { UserClient } from '../../src/data/clients/UserClient'
import { BlobStorageClient } from '../../src/data/clients/BlobStorageClient'
import { config } from '../../src/app.config'
import { GroupNotFoundError } from '../../src/domain/group/errors/GroupNotFoundError'

describe('group service', () => {
  let service: GroupService
  let mockRepository: SinonStubbedInstance<GroupRepository>

  before(() => {
    mockRepository = sinon.createStubInstance(GroupRepository)
    service = new GroupService(
      new UserClient(userClientFactory() as any),
      mockRepository as any,
      new BlobStorageClient(config.azure.storage))
  })

  afterEach(() => {
    mockRepository.findById.reset()
    // mockRepository.save.reset()
  })

  describe('find', () => {
    describe('when group does not exist', () => {
      let result: any
      before(async () => {
        mockRepository.findById.resolves(null)
        mockRepository.findBySlug.resolves(null)
        result = await service.find('someInvalidId').catch(err => err)
      })

      it('throws a GroupNotFoundError', () => {
        expect(result).to.be.instanceOf(GroupNotFoundError)
      })
    })

    describe('when profile exists', () => {
      let result: any

      before(async () => {
        mockRepository.findById.resolves(validGroup)
        mockRepository.findById.resolves(validGroup)
        result = await service.find(VALID_GROUP_OBJECT_ID)
      })

      it('returns a valid group', () => {
        expect(result).to.have.property('id').which.is.instanceOf(ObjectId)
        expect(result.id.toString()).be.equal(VALID_GROUP_OBJECT_ID)
      })
      
    })
  })

})
