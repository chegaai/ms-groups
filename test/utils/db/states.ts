// import { ObjectId } from 'mongodb'
import { validGroup } from '../../mocks/groups'
import { COLLECTION as GROUPS_COLLECTION } from '../../../src/data/repositories/GroupRepository'
import { StateMap } from '@irontitan/sloth/dist/modules/database/state-map'

export const stateNames = {
  validEmptyGroupExists: 'validEmptyGroupExists',
  validGroupExistsWithGroup: 'validGroupExistsWithGroup',
  twoValidEmptyGroupsExist: 'twoValidEmptyGroupsExist'
}

export const states: StateMap = {
  [stateNames.validEmptyGroupExists]: [
    {
      collection: GROUPS_COLLECTION,
      data: validGroup
    }
  ]
}

export type States = typeof states
