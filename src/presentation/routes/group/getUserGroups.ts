import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { validate } from '@expresso/validator'
import { UserNotFoundError } from '../../../domain/group/errors/UserNotFoundError'
import boom from 'boom'

export function factory (service: GroupService) {
  return [
    validate.query({
      type: 'object',
      properties: {
        page: { type: 'number', default: 0 },
        size: { type: 'number', default: 10 }
      }
    }),
    rescue(async (req: Request, res: Response) => {
      const searchResult = await service.searchByFollowedUser(req.params.userId, req.query.page, req.query.size)
      const { count, range, results, total } = searchResult
      const status = total > count ? 206 : 200

      if (status === 206) res.append('x-content-range', `${range.from}-${range.to}/${total}`)

      res.status(status)
        .json(results.map(result => result.toObject()))
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError) return next(boom.notFound(err.message, { code: 'user_not_found' }))
      next(err)
    }
  ]
}
