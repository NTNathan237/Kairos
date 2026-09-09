const express = require('express');
const router = express.Router();

const semaineRoutes = require('./semaine')
const typeRoutes = require('./type')
const tacheRoutes = require('./tache')
const objectifRoutes = require('./objectif')
const assignationRoutes = require('./assignation')

router.use("/",semaineRoutes)
router.use("/",tacheRoutes)
router.use("/",typeRoutes)
router.use("/",objectifRoutes)
router.use("/",assignationRoutes)

module.exports = router