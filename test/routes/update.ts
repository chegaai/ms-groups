// import nock from 'nock'
import sinon from 'sinon'
import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
// import { ObjectId } from 'bson'
import app from '../../src/presentation/app'
// import { isGroup } from '../utils/is-group'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { config, IAppConfig } from '../../src/app.config'
import { validGroup } from '../mocks/groups'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { BlobStorageClient }  from '../../src/data/clients/BlobStorageClient'

const options: IAppConfig = {
  ...config,
  microServices: {
    profile: {
      url: 'http://ms-profile.mock'
    }
  },
}

describe('PUT /', () => {
  let api: AxiosInstance
  let database: SlothDatabase<States>
<<<<<<< HEAD
  
=======
>>>>>>> master

  before(async () =>{
    
    sinon.stub(BlobStorageClient.prototype, 'uploadBase64')
    .callsFake(async (args) => {
      return new Promise((resolve) => { resolve(`https://url.com/${args}`)});
    })
    
    database = await sloth.database.init(states)
    await database.setState('validEmptyGroupExists')
    api = axiosist(await app.factory({ ...options, database: { mongodb: database.config } }, env.TEST))
  })

  afterEach(async () => {
    await database.clear()
  })

  after(async () => {
    await database.stop()
    ;(BlobStorageClient.prototype.uploadBase64 as any).restore()
  })

  describe('When group do not exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.clear()
      response = await api.put(`/${validGroup.id.toHexString()}`, {})
    })

    it('returns a 404 status code', () => {
      expect(response.status).to.be.equal(404)
    })

    it('returns an `group_not_found` error code', () => {
      expect(response.data.error?.code).to.be.equal('group_not_found')
    })
  })

  // TODO: finish this implementation
  // describe('when orginzer is not found', () => {
  //   let response: AxiosResponse
  //   let profile0Scope: nock.Scope
  //   let profile1Scope: nock.Scope
  //   const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

    
  //   function mockProfileRequest(organizer: ObjectId){
  //     return nock(options.microServices.profile.url)
  //     .get(`/${organizer.toHexString()}`)
  //     .reply(404)
  //   }

  //   before(async () => {      
  //     profile0Scope = mockProfileRequest(updateGroupData.organizers[0])
  //     profile1Scope = mockProfileRequest(updateGroupData.organizers[1])

  //     response = await api.put(`/${validGroup.id}`, updateGroupData)

  //   })

  //   it('calls ms-profile to validate the given profile IDs', () => {
  //     expect(profile0Scope.isDone()).to.be.true
  //     expect(profile1Scope.isDone()).to.be.true
  //   })
  
  //   it('returns a 200 status code', () => {
  //     expect(response.status).to.be.equal(201)
  //   })

  //   it('returns a valid group', () => {
  //     isGroup(response.data)
  //   })

  //   it('returns picture as a azure URI', () => {
  //     expect(response.data.pictures).to.exist
  //     expect(response.data.pictures.profile.match(urlRegex).length > 0).to.be.true
  //     expect(response.data.pictures.banner.match(urlRegex).length > 0).to.be.true
  //   })

  // })

})
