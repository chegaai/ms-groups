import { factory as create } from './group/create'
import { factory as update } from './group/update'
import { factory as remove } from './group/remove'
import { factory as listAll } from './group/listAll'
import { factory as find } from './group/find'
import { factory as getFollowers } from './group/followedBy'


export const routes = {
  create,
  update,
  remove,
  find,
  listAll,
  getFollowers
}
