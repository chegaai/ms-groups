import { ObjectId } from 'mongodb'
import { validGroup } from '../../mocks/groups'
import { COLLECTION as GROUPS_COLLECTION } from '../../../src/data/repositories/GroupRepository'
import { StateMap } from '@irontitan/sloth/dist/modules/database/state-map'

export const stateNames = {
  validEmptyGroupExists: 'validEmptyGroupExists',
  validGroupExistsWithOrganizers: 'validGroupExistsWithOrganizers',
  twoValidEmptyGroupsExist: 'twoValidEmptyGroupsExist'
}

export const states: StateMap = {
  [stateNames.validEmptyGroupExists]: [
    {
      collection: GROUPS_COLLECTION,
      data: validGroup
    }
  ],
  [stateNames.validEmptyGroupExists]: [
    {
      collection: GROUPS_COLLECTION,
      data: validGroup
    }
  ],
  [stateNames.validGroupExistsWithOrganizers]: [
    {
      collection: GROUPS_COLLECTION,
      data: { ...validGroup, organizers: [new ObjectId('5e1930713af2d8471df20487'), new ObjectId('5e1930a57acc1c1d2b8c369a')] }
    }
  ]
}

export type States = typeof states
