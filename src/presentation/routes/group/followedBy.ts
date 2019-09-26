import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { validate } from '@expresso/validator'

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
      const groups = await service.searchByFollowedUser(req.params.userId, req.query.page, req.query.size)

      res.status(200)
        .set({
          'x-range-from': groups.range.from,
          'x-range-to': groups.range.to,
          'x-range-total': groups.total,
          'x-range-size': groups.count
        })
        .json(groups.results)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}
