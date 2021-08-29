const express = require('express')
const router = express.Router()
const http = require("http")
const config = require("../settings/settings.json")

/**
 * Main page rendering
 */
router.get('/', (req, res) => {
  res.render('index', { resError: req.query.error })
})

module.exports = router
