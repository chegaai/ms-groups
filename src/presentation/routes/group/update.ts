import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupNotFoundError } from '../../../domain/group/errors/GroupNotFoundError'
import { OrganizerNotFoundError } from '../../../domain/group/errors/OrganizerNotFoundError'

export default function factory (service: GroupService) {
  return [
    validate({
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
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
        organizers: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        location: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const groupData = req.body
      const groupId = req.params.groupId
      const group = await service.update(groupId, groupData)

      res.status(200)
        .json(group.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupNotFoundError) return next(boom.notFound(err.message, { code: 'group_not_found' }))
      if (err instanceof OrganizerNotFoundError) return next(boom.badData(err.message, { code: 'organizer_not_found' }))

      next(err)
    }
  ]
}
