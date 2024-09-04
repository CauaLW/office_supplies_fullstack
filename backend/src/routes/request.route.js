const express = require('express')
const router = express.Router()

const requestController = require('../controllers/request.controller')

router.post('/', async (req, res) => {
    try {
        const createData = req.body
        const createdRequest = await requestController.createRequest(createData)

        return res.json(createdRequest)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

router.put('/approve/:requestId', async (req, res) => {
    try {
        const idToAprrove = req.params.requestId
        await requestController.approveRequest(idToAprrove)
        return res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

router.put('/reject/:requestId', async (req, res) => {
    try {
        const idToReject = req.params.requestId
        const { observations } = { ...req.body }
        await requestController.rejectRequest(idToReject, observations)
        return res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

router.get('/', async (req, res) => {
    try {
        const { itemDescription, applicantName, approved } = req.query

        const filters = {
            itemDescription,
            applicantName,
            approved: approved !== undefined ? JSON.parse(approved) : undefined, // Convert 'approved' to bool if given
        }

        const requests = await requestController.getRequests(filters)
        return res.json(requests)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const requestId = req.params.id

        const request = await requestController.getRequest(requestId)
        if (request == null) return res.sendStatus(404)
        return res.json(request)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

module.exports = router