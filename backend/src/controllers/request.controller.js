const Joi = require('joi')
const { RequestModel } = require("../models")
const { Op } = require('sequelize')

const createSchema = Joi.object({
    applicantName: Joi.string().max(150).required(),
    itemDescription: Joi.string().max(150).required(),
    itemPrice: Joi.number().positive().integer().required(),
})
exports.createRequest = async function (requestObject) {
    const { error: validationError } = createSchema.validate(requestObject)
    if (validationError) {
        throw new Error(validationError.details[0].message)
    }

    const createdRequest = await RequestModel.create(requestObject)
    return createdRequest
}

exports.approveRequest = async function (requestId) {
    const requestToApprove = await RequestModel.findByPk(
        requestId,
        {
            attributes: ['id']
        }
    )
    if (requestToApprove == null) throw new Error('Request not found on database')
    await requestToApprove.approveRequest()
}

const rejectSchema = Joi.object({
    observations: Joi.string().max(300).required()
})
exports.rejectRequest = async function (requestId, observations) {
    const { error: validationError } = rejectSchema.validate({ observations })
    if (validationError) {
        throw new Error(validationError.details[0].message)
    }

    const requestToReject = await RequestModel.findByPk(
        requestId,
        {
            attributes: ['id']
        }
    )
    if (requestToReject == null) throw new Error('Request not found on database')
    await requestToReject.rejectRequest(observations)
}

exports.getRequests = async function (filters) {
    const where = {}

    if (filters.itemDescription) {
        where.itemDescription = { [Op.like]: `%${filters.itemDescription}%` }
    }

    if (filters.applicantName) {
        where.applicantName = { [Op.like]: `%${filters.applicantName}%` }
    }

    if (typeof filters.approved !== 'undefined') {
        where.approved = filters.approved
    } else {
        where.approved = { [Op.not]: null }
    }

    const requests = await RequestModel.findAll({ where })
    return requests
}

exports.getRequest = async function (requestId) {
    return await RequestModel.findByPk(requestId)
}