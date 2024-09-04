const { Op } = require('sequelize')
const requestController = require('../../controllers/request.controller')
const { RequestModel } = require('../../models')

jest.mock('../../models', () => ({
    RequestModel: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
}))

describe('Request Controller', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createRequest', () => {
        it('must create a request', async () => {
            const requestData = {
                applicantName: 'John Doe',
                itemDescription: 'Laptop',
                itemPrice: 1000,
            }

            RequestModel.create.mockResolvedValue(requestData)
            const result = await requestController.createRequest(requestData)

            expect(RequestModel.create).toHaveBeenCalledWith(requestData)
            expect(result).toEqual(requestData)
        })

        it('must throw an error with invalid data', async () => {
            const invalidData = {
                applicantName: '',
                itemDescription: 'Laptop',
                itemPrice: -100,
            }

            await expect(requestController.createRequest(invalidData)).rejects.toThrow()
        })
    })

    describe('approveRequest', () => {
        it('must approve an existing request', async () => {
            const requestId = 1
            const mockRequest = {
                id: requestId,
                approveRequest: jest.fn(),
            }

            RequestModel.findByPk.mockResolvedValue(mockRequest)

            await requestController.approveRequest(requestId)

            expect(RequestModel.findByPk).toHaveBeenCalledWith(requestId, { "attributes": ["id"] })
            expect(mockRequest.approveRequest).toHaveBeenCalled()
        })

        it('must throw an error if the request was not found', async () => {
            const requestId = 1

            RequestModel.findByPk.mockResolvedValue(null)

            await expect(requestController.approveRequest(requestId)).rejects.toThrow('Request not found on database')
        })
    })

    describe('rejectRequest', () => {
        it('must reject an existing request', async () => {
            const requestId = 1
            const observations = 'Observations value'
            const mockRequest = {
                id: requestId,
                rejectRequest: jest.fn(),
            }

            RequestModel.findByPk.mockResolvedValue(mockRequest)

            await requestController.rejectRequest(requestId, observations)

            expect(RequestModel.findByPk).toHaveBeenCalledWith(requestId, { "attributes": ["id"] })
            expect(mockRequest.rejectRequest).toHaveBeenCalled()
        })

        it('must throw an error if the request was not found', async () => {
            const requestId = 1

            RequestModel.findByPk.mockResolvedValue(null)

            await expect(requestController.rejectRequest(requestId, 'Observations')).rejects.toThrow('Request not found on database')
        })

        it('must throw an error if observations is not given', async () => {
            const requestId = 1
            const mockRequest = {
                id: requestId,
                rejectRequest: jest.fn(),
            }

            RequestModel.findByPk.mockResolvedValue(mockRequest)

            await expect(requestController.rejectRequest(requestId)).rejects.toThrow('"observations" is required')
        })
    })

    describe('getRequests', () => {
        it('must return all requests when no filter is given', async () => {
            const mockRequests = [
                { id: 1, applicantName: 'John Doe', itemDescription: 'Laptop', itemPrice: 1000, approved: null },
                { id: 2, applicantName: 'Jane Smith', itemDescription: 'Monitor', itemPrice: 200, approved: true },
            ]

            // findAll mock to return all mocked requests
            RequestModel.findAll.mockResolvedValue(mockRequests)

            const result = await requestController.getRequests({})

            expect(RequestModel.findAll).toHaveBeenCalledWith({ where: {} })
            expect(result).toEqual(mockRequests)
        })

        it('must return only requests that apply to applicantName filter', async () => {
            const filters = { applicantName: 'John' }
            const mockRequests = [
                { id: 1, applicantName: 'John Doe', itemDescription: 'Laptop', itemPrice: 1000, approved: null },
            ]

            RequestModel.findAll.mockResolvedValue(mockRequests)

            const result = await requestController.getRequests(filters)

            expect(RequestModel.findAll).toHaveBeenCalledWith({
                where: {
                    applicantName: { [Op.like]: '%John%' },
                },
            })
            expect(result).toEqual(mockRequests)
        })

        it('must return only requests that apply to itemDescription filter', async () => {
            const filters = { itemDescription: 'Laptop' }
            const mockRequests = [
                { id: 1, applicantName: 'John Doe', itemDescription: 'Laptop', itemPrice: 1000, approved: null },
            ]

            RequestModel.findAll.mockResolvedValue(mockRequests)

            const result = await requestController.getRequests(filters)

            expect(RequestModel.findAll).toHaveBeenCalledWith({
                where: {
                    itemDescription: { [Op.like]: '%Laptop%' },
                },
            })
            expect(result).toEqual(mockRequests)
        })

        it('must return only requests that apply to approved filter', async () => {
            const filters = { approved: true }
            const mockRequests = [
                { id: 2, applicantName: 'Jane Smith', itemDescription: 'Monitor', itemPrice: 200, approved: true },
            ]

            RequestModel.findAll.mockResolvedValue(mockRequests)

            const result = await requestController.getRequests(filters)

            expect(RequestModel.findAll).toHaveBeenCalledWith({
                where: {
                    approved: true,
                },
            })
            expect(result).toEqual(mockRequests)
        })

        it('must return an empty array if none request applies to the filters', async () => {
            const filters = { applicantName: 'Nonexistent' }

            RequestModel.findAll.mockResolvedValue([])

            const result = await requestController.getRequests(filters)

            expect(RequestModel.findAll).toHaveBeenCalledWith({
                where: {
                    applicantName: { [Op.like]: '%Nonexistent%' },
                },
            })
            expect(result).toEqual([])
        })
    })
})
