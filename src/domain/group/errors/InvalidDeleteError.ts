export class InvalidDeleteError extends Error {
  constructor () {
    super('Group cannot be deleted because user is not the group founder')
  }
}
