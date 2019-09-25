import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { InvalidGroupError } from '../../../domain/group/errors/InvalidGroupError'

export function factory (service: GroupService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const groupId = req.params.groupId
      await service.delete(groupId)

      res.status(204).end()
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidGroupError) return next(boom.badData(err.message, { code: 'invalid_group_id' }))
      next(err)
    }
  ]
}
