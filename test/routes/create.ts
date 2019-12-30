import nock from 'nock'
import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
// import { ObjectId } from 'mongodb'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { createGroupData } from '../mocks/groups'
// import AxiosMockAdapter from 'axios-mock-adapter'
import { config, IAppConfig } from '../../src/app.config'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import omit from 'lodash.omit'
// import { SerializedGroup as Group } from '../../src/domain/group/structures/SerializedGroup'
// import { COLLECTION as GROUP_COLLECTION } from '../../src/data/repositories/GroupRepository'
// import { isGroup } from '../utils/is-group'

const options: IAppConfig = {
  ...config,
  microServices: {
    user: {
      url: 'http://ms-groups.mock'
    }
  },
}

describe('POST /', () => {
  let api: AxiosInstance
  let database: SlothDatabase<States>

  before(async () =>{
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

  // describe('when group do not exists yet', () => {
  //   let response: AxiosResponse

  //   before(async () => {
  //     response = await api.post('/', { ...createGroupData })
  //   })

  //   it('returns a 200 status code', () => {
  //     console.log(response)
  //     expect(response.status).to.be.equal(200)
  //   })
  // })


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
    let userScope: nock.Scope

    before(async () => {
      userScope = nock(options.microServices.user.url)
        .get(`/${createGroupData.founder}`)
        .reply(404)
      response = await api.post('/', createGroupData)
    })

    it('calls ms-user to validate the given user IDs', () => {
      expect(userScope.isDone()).to.be.true
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
      // TODO: how to mock the findUser request to get a valid founder but dont find a orginizer.
      // See the src/services/GroupService.ts:46 for more details
    })

  })

})
