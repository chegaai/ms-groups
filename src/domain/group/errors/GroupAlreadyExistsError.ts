import { DomainError } from '../../domain.error'

export class GroupAlreadyExistsError extends DomainError {
  constructor (document: string) {
    super(`Group ${document} already exists`)
  }
}
