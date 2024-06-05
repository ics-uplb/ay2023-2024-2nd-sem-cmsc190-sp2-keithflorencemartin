const Isolate = require("../models/IsolateInfo.js");
const Location = require("../models/Location.js");
const Cave = require("../models/Cave.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllCaves = async (req, res, next) => {
  try {
    const caves = await Cave.findAll();
    if (!caves || caves.length === 0) {
      //Handle empty result
      logConfig.info("No caves found in the database.");
      res.status(204).json(caves);
    } else {
      logConfig.info("Retrieved all caves from the database.");
      res.status(200).json(caves);
    }
  } catch (error) {
    next(error);
  }
};

const getCaveById = async (req, res, next) => {
  try {
    const cave = await Cave.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!cave || cave.length === 0) {
      const error = new Error(`Cave with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved cave with ID ${req.params.id} from the database.`
    );
    res.status(200).json(cave);
  } catch (error) {
    next(error);
  }
};

const getCaveByKeyword = async (req, res, next) => {
  const { cave } = req.query;

  try {
    if (!cave) {
      const error = new Error("'cave' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await Cave.findAll({
      where: {
        cave_name: { [Op.like]: `%${cave}%` },
      },
    });

    logConfig.info(
      `Retrieved caves based on search parameters: ${JSON.stringify({
        cave,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createCave = async (req, res, next) => {
  const { cave_code, cave_name, cave_location_code } = req.body;

  // Check for missing required fields
  if (!cave_code || !cave_name || !cave_location_code) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    const location = await Location.findOne({
      where: {
        location_code: cave_location_code,
      },
    });

    if (!location) {
      const error = new Error(
        `Location with code '${cave_location_code}' not found.`
      );
      error.status = 404;
      throw error;
    }

    // Check if cave code or name is already taken
    const existingCaveCode = await Cave.findOne({
      where: {
        cave_code: cave_code
      },
    });

    const existingCaveName = await Cave.findOne({
      where: {
        cave_name: cave_name,
      },
    });

    if (existingCaveCode || existingCaveName) {
      const existingEntities = [];
      if (existingCaveCode) existingEntities.push("code");
      if (existingCaveName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(`Cave ${existingEntitiesString} already exists.`);
      error.status = 404;
      throw error;
    }

    const location_id = location.id;

    const newCave = await Cave.create({
      cave_code,
      cave_name,
      location_id,
    });

    logConfig.info("Cave successfully created in the database.");
    res.status(201).json(newCave);
  } catch (error) {
    next(error);
  }
};

const updateCave = async (req, res, next) => {
  const { cave_code, cave_name, cave_location_code } = req.body;

  try {
    // Check first if the cave exists
    const cave = await Cave.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!cave) {
      const error = new Error(`Cave with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    const location = await Location.findOne({
      where: {
        location_code: cave_location_code,
      },
    });

    if (!location) {
      const error = new Error(
        `Location with code '${cave_location_code}' not found.`
      );
      error.status = 404;
      throw error;
    }

    // Check if cave code or name is already taken
    const existingCaveCode = await Cave.findOne({
      where: {
        cave_code: cave_code,
        id: { [Op.ne]: req.params.id },
      },
    });

    const existingCaveName = await Cave.findOne({
      where: {
        cave_name: cave_name,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingCaveCode || existingCaveName) {
      const existingEntities = [];
      if (existingCaveCode) existingEntities.push("code");
      if (existingCaveName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(`Cave ${existingEntitiesString} already exists.`);
      error.status = 404;
      throw error;
    }

    const location_id = location.id;

    // Check if any data is provided for update
    if (!(cave_code || cave_name || cave_location_code)) {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }

    const caveUpdate = {
      cave_code,
      cave_name,
      location_id,
    };

    await Cave.update(caveUpdate, {
      where: {
        id: req.params.id,
      },
    });

    const updatedCave = await Cave.findByPk(req.params.id);

    if (!updatedCave) {
      const error = new Error(
        `Cave with ID ${req.params.id} not found after update.`
      );
      error.status = 404;
      throw error;
    }

    logConfig.info(`Cave with ID ${req.params.id} updated in the database.`);
    res.status(200).json(updatedCave);
  } catch (error) {
    next(error);
  }
};

const deleteCave = async (req, res, next) => {
  try {
    // Check first if the cave exists
    const cave = await Cave.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!cave) {
      const error = new Error(
        `Cave with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if cave is in use before deleting
    const caveInUse = await Isolate.findOne({
      where: {
        cave_id: req.params.id,
      },
    });

    if (caveInUse) {
      const error = new Error("Cave is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Cave.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(`Cave with ID ${req.params.id} deleted from the database.`);
    res.status(200).json({
      message: "Cave successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCaves,
  getCaveById,
  getCaveByKeyword,
  createCave,
  updateCave,
  deleteCave,
};
