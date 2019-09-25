import { injectable } from 'tsyringe'
import { GroupService } from './GroupService'

@injectable()
export class Services {
  constructor (
    public readonly group: GroupService
  ) { }
}
