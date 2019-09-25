import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupAlreadyExistsError } from '../../../domain/group/errors/GroupAlreadyExistsError'
import { FounderNotFoundError } from '../../../domain/group/errors/FounderNotFoundError'
import { InvalidGroupError } from '../../../domain/group/errors/InvalidGroupError';

export function factory (service: GroupService) {
  return [
    validate({
      type: 'object',
      properties: {
        name: { type: 'string' },
        founderId: { type: 'string' },
        pictures: {
          type: 'object',
          properties: {
            profile: { type: 'string' },
            banner: { type: 'string' }
          }
        },
        socialNetworks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              link: { type: 'string' }
            }
          }
        },
        tags: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        taorganizersgs: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      required: ['name', 'founderId', 'tags'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const groupData = req.body
      const group = await service.create(groupData)

      res.status(201)
        .json(group)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupAlreadyExistsError) return next(boom.conflict(err.message, { code: 'group_already_exists' }))
      if (err instanceof InvalidGroupError) return next(boom.badData(err.message, { code: 'invalid_group' }))
      if (err instanceof FounderNotFoundError) return next(boom.badData(err.message, { code: 'founder_not_found' }))

      next(err)
    }
  ]
}
