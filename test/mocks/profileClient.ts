import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export function factory(): MockAdapter{
    const mock = new MockAdapter(axios);

    mock.onGet('/users/5ddbd49d7c55670010b63ad4')
        .reply(200, {
            id: '5ddbd49d7c55670010b63ad4',
            email: 'ewrew@r3d83r2ew.com',
            name: 'Lucas Santos',
            lastName: 'lastNamez',
            picture: 'https://chegaai.blob.core.windows.net/profiles/5ddbd49d0c75e200b8a1dce8',
            socialNetworks: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/_staticvoid'
                },
                {
                    name: 'GitHub',
                    link: 'https://github.com/khaosdoctor'
                }
            ],
            language: 'pt-br',
            location: {
                country: 'BR',
                state: 'São Paulo',
                city: 'Santo André'
            },
            tags: [
                'javascript',
                'typescript',
                'kubernetes'
            ],
            groups: [],
            deletedAt: null,
            createdAt: '2019-11-25T13:18:21.735Z',
            updatedAt: '2019-11-25T13:18:21.735Z'
        })

    return mock
}

export default { factory }