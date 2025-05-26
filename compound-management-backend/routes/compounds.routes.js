const express = require('express');
const router = express.Router();
const compoundsController = require('../controllers/compounds.controller');

// GET all compounds with pagination
router.get('/', compoundsController.findAll);

// GET single compound by ID
router.get('/:id', compoundsController.findOne);

// PUT update compound
router.put('/:id', compoundsController.update);

// POST create new compound (optional)
router.post('/', compoundsController.create);

// DELETE compound (optional)
router.delete('/:id', compoundsController.delete);

module.exports = router;