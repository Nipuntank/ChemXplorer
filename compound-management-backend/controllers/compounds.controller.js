const db = require('../models');
const Compound = db.Compound;

// Get all compounds with pagination
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Compound.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single compound by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const compound = await Compound.findByPk(id);
    
    if (!compound) {
      return res.status(404).json({ error: 'Compound not found' });
    }
    
    res.json(compound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a compound
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, image, description } = req.body;

    const [updated] = await Compound.update(
      { name, image, description },
      { where: { id } }
    );

    if (updated) {
      const updatedCompound = await Compound.findByPk(id);
      return res.json(updatedCompound);
    }

    throw new Error('Compound not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a compound (optional)
exports.create = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const compound = await Compound.create({ name, image, description });
    res.status(201).json(compound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a compound (optional)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Compound.destroy({ where: { id } });
    
    if (deleted) {
      return res.json({ message: 'Compound deleted' });
    }
    
    throw new Error('Compound not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};