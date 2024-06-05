const Isolate = require("../models/IsolateInfo.js");
const Organism = require("../models/Organism.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllOrganisms = async (req, res, next) => {
  try {
    const organisms = await Organism.findAll();
    if (!organisms || organisms.length === 0) {
      //Handle empty result
      logConfig.info("No organisms found in the database.");
      res.status(204).json(organisms);
    } else {
      logConfig.info("Retrieved all organisms from the database.");
      res.status(200).json(organisms);
    }
  } catch (error) {
    next(error);
  }
};

const getOrganismById = async (req, res, next) => {
  try {
    const organism = await Organism.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!organism || organism.length === 0) {
      const error = new Error(`Organism with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved organism with ID ${req.params.id} from the database.`
    );
    res.status(200).json(cave);
  } catch (error) {
    next(error);
  }
};

const getOrganismByKeyword = async (req, res, next) => {
  const { organism } = req.query;

  try {
    if (!organism) {
      const error = new Error("'organism' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await Organism.findAll({
      where: {
        organism_type: { [Op.like]: `%${organism}%` },
      },
    });

    logConfig.info(
      `Retrieved organisms based on search parameters: ${JSON.stringify({
        organism,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createOrganism = async (req, res, next) => {
  const { organism_type, value } = req.body;
  const intValue = parseInt(value, 10);

  // Check for missing required fields
  if (!organism_type || !value) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if the value is a valid number
    const isNumeric = /^\d+$/.test(value);
    if (!isNumeric) {
      const error = new Error("Value must contain only digits.");
      error.status = 400;
      throw error;
    }

    // Check if organism type or value is already taken
    const existingOrganismType = await Organism.findOne({
      where: {
        organism_type: organism_type,
      },
    });

    const existingValue = await Organism.findOne({
      where: {
        value: intValue,
      },
    });

    if (existingOrganismType || existingValue) {
      const existingEntities = [];
      if (existingOrganismType) existingEntities.push("type");
      if (existingValue) existingEntities.push("value");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Organism ${existingEntitiesString} already exists.`
      );
      error.status = 400;
      throw error;
    }

    const newOrganism = await Organism.create(req.body);
    logConfig.info("Organism created in the database.");
    res.status(201).json(newOrganism);
  } catch (error) {
    next(error);
  }
};

const updateOrganism = async (req, res, next) => {
  const { organism_type, value } = req.body;
  const intValue = parseInt(value, 10);

  try {
    // Check if the value is a valid number
    const isNumeric = /^\d+$/.test(value);
    if (!isNumeric) {
      const error = new Error("Value must contain only digits.");
      error.status = 400;
      throw error;
    }

    // Check if the organism exists
    const organism = await Organism.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!organism) {
      const error = new Error(`Organism with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if organism type or value is already taken
    const existingOrganismType = await Organism.findOne({
      where: {
        organism_type: organism_type,
        id: { [Op.ne]: req.params.id },
      },
    });

    const existingValue = await Organism.findOne({
      where: {
        value: intValue,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingOrganismType || existingValue) {
      const existingEntities = [];
      if (existingOrganismType) existingEntities.push("type");
      if (existingValue) existingEntities.push("value");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Organism ${existingEntitiesString} already exists.`
      );
      error.status = 404;
      throw error;
    }

    // Perform update if organism is found
    if (organism_type || intValue) {
      await Organism.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // Update IsolateInfo code if organism value is updated
      if (intValue) {
        const isolates = await Isolate.findAll({
          where: {
            organism_id: req.params.id,
          },
        });

        const updatePromises = isolates.map(async (isolate) => {
          const parts = isolate.accession_no.split("-");
          parts[2] = intValue + isolate.id;
          const newAccessionNo = parts.join("-");

          return Isolate.update(
            { code: intValue + isolate.id, accession_no: newAccessionNo },
            { where: { id: isolate.id } }
          );
        });

        await Promise.all(updatePromises);
      }

      const updatedOrganism = await Organism.findByPk(req.params.id);

      if (!updatedOrganism) {
        const error = new Error(
          `Organism with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Organism with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedOrganism);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteOrganism = async (req, res, next) => {
  try {
    // Check first if the organism exists
    const organism = await Organism.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!organism) {
      const error = new Error(
        `Organism with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if organism is in use before deleting
    const organismInUse = await Isolate.findOne({
      where: {
        organism_id: req.params.id,
      },
    });

    if (organismInUse) {
      const error = new Error("Organism is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Organism.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Organism with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Organism successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrganisms,
  getOrganismById,
  getOrganismByKeyword,
  createOrganism,
  updateOrganism,
  deleteOrganism,
};
