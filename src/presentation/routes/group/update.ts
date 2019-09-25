import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupNotFoundError } from '../../../domain/group/errors/GroupNotFoundError';

export function factory (service: GroupService) {
  return [
    validate({
      type: 'object',
      properties: {
        name: { type: 'string' },
        pictures: {
            type: 'object',
            properties:{
              profile: { type: 'string' },
              banner: { type: 'string' }
            }
        },
        socialNetworks:{
          type: 'object',
          properties: {
            facebook: { type: 'string' },
            linkedin: { type: 'string' },
            twitter: { type: 'string' },
            medium: { type: 'string' },
            speakerDeck: { type: 'string' },
            pinterest: { type: 'string' },
            instagram: { type: 'string' },
            others: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  link: { type: 'string' } 
                }
              }
            }
          }
        },
        tags: {
          type: 'array',
          items:{
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const groupData = req.body
      const groupId = req.params.groupId
      const group = await service.update(groupId, groupData)

      res.status(200)
        .json(group)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupNotFoundError) return next(boom.notFound(err.message, { code: 'group_not_found' }))

      next(err)
    }
  ]
}
