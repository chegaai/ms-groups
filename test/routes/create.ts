import nock from 'nock'
import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import omit from 'lodash.omit'
import sloth from '@irontitan/sloth'
import { isGroup } from '../utils/is-group'
import app from '../../src/presentation/app'
import { createGroupData } from '../mocks/groups'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { config, IAppConfig } from '../../src/app.config'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { BlobStorageClient }  from '../../src/data/clients/BlobStorageClient'
import sinon from 'sinon'

const options: IAppConfig = {
  ...config,
  microServices: {
    profile: {
      url: 'http://ms-profile.mock'
    }
  },
}

describe('POST /', () => {
  let api: AxiosInstance
  let database: SlothDatabase<States>
  

  before(async () =>{
    sinon.stub(BlobStorageClient.prototype, 'uploadBase64')
         .callsFake(async (args) => {
            return new Promise((resolve) => { resolve(`https://url.com/${args}`)});
          })

    database = await sloth.database.init(states)
    api = axiosist(await app.factory({ ...options, database: { mongodb: database.config } }, env.TEST))
  })

  afterEach(async () => {
    await database.clear()
  })

  after(async () => {
    await database.stop()
  })

  describe('When required parameters are missing', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.post('/', {})
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns an `unprocessable_entity` error code', () => {
      expect(response.data.error?.code).to.be.equal('unprocessable_entity')
    })
  })

  describe('when group do not exists yet', () => {
    let response: AxiosResponse
    let profileScope: nock.Scope
    const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    
    before(async () => {
      const founderId = createGroupData.founder.toHexString()
      profileScope = nock(options.microServices.profile.url)
        .get(`/${founderId}`)
        .reply(200, { id: founderId })
        
      response = await api.post('/', createGroupData)
    })

    it('calls ms-user to validate the given user IDs', () => {
      expect(profileScope.isDone()).to.be.true
    })

    it('returns a 201 status code', () => {
      expect(response.status).to.be.equal(201)
    })

    it('returns a valid group', () => {
      isGroup(response.data)
    })

    it('returns picture as a azure URI', () => {
      expect(response.data.pictures).to.exist
      expect(response.data.pictures.profile.match(urlRegex).length > 0).to.be.true
      expect(response.data.pictures.banner.match(urlRegex).length > 0).to.be.true
    })
  })

  describe('when name already exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validEmptyGroupExists')
      response = await api.post('/', createGroupData)
    })

    it('returns a 409 status code', () => {
      expect(response.status).to.be.equal(409)
    })

    it('returns a `group_already_exists` error code', () => {
      expect(response.data.error?.code).to.be.equal('group_already_exists')
    })
  })

  describe('when founder do not exists', () => {
    let response: AxiosResponse
    let profileScope: nock.Scope

    before(async () => {
      profileScope = nock(options.microServices.profile.url)
        .get(`/${createGroupData.founder}`)
        .reply(404)
      
      response = await api.post('/', createGroupData)
    })

    it('calls ms-user to validate the given user IDs', () => {
      expect(profileScope.isDone()).to.be.true
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns a `founder_not_found` error code', () => {
      expect(response.data.error?.code).to.be.equal('founder_not_found')
    })
  })

  describe('when founder is missing', () => {
    let response: AxiosResponse

    before(async () => {
      const payload = omit(createGroupData, [
        'founder'
      ])
      response = await api.post('/', payload)
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns a `missing_founder` error code', () => {
      expect(response.data.error?.code).to.be.equal('missing_founder')
    })
  })

  describe('when orginzer is not found [NOT IMPLEMENTED]', () => {
 
    before(async () => {
      /* TODO: how to mock the findUser request to get a valid founder
       but dont find a orginizer.*/
       
      // See the src/services/GroupService.ts:46 for more details
    })

  })

})
