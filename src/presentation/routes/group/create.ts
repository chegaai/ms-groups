import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { IExpressoRequest } from '@expresso/app'
import { Request, Response, NextFunction } from 'express'
import { GroupService } from '../../../services/GroupService'
import { GroupAlreadyExistsError } from '../../../domain/group/errors/GroupAlreadyExistsError'
import { FounderNotFoundError } from '../../../domain/group/errors/FounderNotFoundError'
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
          required: [ 'city', 'state', 'country' ]
        },
        founder: { type: 'string' }
      },
      required: [ 'name', 'description', 'tags', 'location' ],
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<any>, res: Response) => {
      if (!req.onBehalfOf && !req.body.founder)
        throw new MissingFounderError()

      const founder = (req.onBehalfOf) ? req.onBehalfOf : req.body.founder
      const groupData = { ...req.body, founder }

      const group = await service.create(groupData)

      res.status(201)
        .json(group.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof GroupAlreadyExistsError) return next(boom.conflict(err.message, { code: 'group_already_exists' }))
      if (err instanceof FounderNotFoundError) return next(boom.badData(err.message, { code: 'founder_not_found' }))
      if (err instanceof OrganizerNotFoundError) return next(boom.badData(err.message, { code: 'organizer_not_found' }))
      if (err instanceof MissingFounderError) return next(boom.badData(err.message, { code: 'missing_founder' }))

      next(err)
    }
  ]
}
