import find from './group/find'
import create from './group/create'
import update from './group/update'
import remove from './group/remove'
import listAll from './group/listAll'
import getUserGroups from './group/getUserGroups'
import getGroupsByOrganizerOrFounder from './group/getGroupsByOrganizerOrFounder'


export const routes = {
  create,
  update,
  remove,
  find,
  listAll,
  getUserGroups,
  getGroupsByOrganizerOrFounder
}
