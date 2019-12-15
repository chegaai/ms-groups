import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { IExpressoRequest } from '@expresso/app'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupAlreadyExistsError } from '../../../domain/group/errors/GroupAlreadyExistsError'
import { FounderNotFoundError } from '../../../domain/group/errors/FounderNotFoundError'
import { InvalidGroupError } from '../../../domain/group/errors/InvalidGroupError'
import { OrganizerNotFoundError } from '../../../domain/group/errors/OrganizerNotFoundError'
import { DomainError } from '../../../domain/domain.error'

class MissingFounderError extends DomainError {

}

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
          additionalProperties: false,
          required: ['city', 'state', 'country']
        }
      },
      required: ['name', 'description', 'tags', 'location'],
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<any>, res: Response) => {
      const groupData = { ...req.body, founder: req.onBehalfOf }

      const group = await service.create(groupData)

      res.status(201)
        .json(group.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupAlreadyExistsError) return next(boom.conflict(err.message, { code: 'group_already_exists' }))
      if (err instanceof InvalidGroupError) return next(boom.badData(err.message, { code: 'invalid_group' }))
      if (err instanceof FounderNotFoundError) return next(boom.badData(err.message, { code: 'founder_not_found' }))
      if (err instanceof OrganizerNotFoundError) return next(boom.badData(err.message, { code: 'organizer_not_found' }))
      if (err instanceof MissingFounderError) return next(boom.badData(err.message, { code: 'missing_founder' }))

      next(err)
    }
  ]
}
