import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupNotFoundError } from '../../../domain/group/errors/GroupNotFoundError'

export default function factory (service: GroupService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const groupId = req.params.groupId
      const group = await service.find(groupId)

      res.status(200)
        .json(group.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupNotFoundError) return next(boom.notFound(err.message, { code: 'group_not_found' }))

      next(err)
    }
  ]
}
