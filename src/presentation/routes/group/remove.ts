import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { IExpressoRequest } from '@expresso/app'
import { InvalidDeleteError } from '../../../domain/group/errors/InvalidDeleteError'

export default function factory (service: GroupService) {
  return [
    rescue(async (req: IExpressoRequest<unknown, { groupId: string }, unknown>, res: Response) => {
      const groupId = req.params.groupId
      await service.delete(groupId, req.onBehalfOf as string)

      res.status(204).end()
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidDeleteError) return next(boom.forbidden(err.message, { code: 'user_is_not_group_founder' }))
      next(err)
    }
  ]
}
