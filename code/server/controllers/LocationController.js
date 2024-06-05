const Cave = require("../models/Cave.js");
const Location = require("../models/Location.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.findAll();
    if (!locations || locations.length === 0) {
      //Handle empty result
      logConfig.info("No locations found in the database.");
      res.status(204).json(locations);
    } else {
      logConfig.info("Retrieved all locations from the database.");
      res.status(200).json(locations);
    }
  } catch (error) {
    next(error);
  }
};

const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!location || location.length === 0) {
      const error = new Error(`Location with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved location with ID ${req.params.id} from the database.`
    );
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
};

const getLocationByKeyword = async (req, res, next) => {
  const { town, province } = req.query;

  try {
    if (!town && !province) {
      const error = new Error(
        "At least one of 'town' or 'province' is required for search."
      );
      error.status = 400;
      return next(error);
    }

    let whereCondition = {};
    if (town) {
      whereCondition.town = { [Op.like]: `%${town}%` };
    }
    if (province) {
      whereCondition.province = { [Op.like]: `%${province}%` };
    }

    const results = await Location.findAll({
      where: whereCondition,
    });

    logConfig.info(
      `Retrieved locations based on search parameters: ${JSON.stringify({
        town,
        province,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createLocation = async (req, res, next) => {
  const { location_code, town, province } = req.body;

  // Check for missing required fields
  if (!location_code || !town || !province) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if location code or town is already taken
    const existingLocationCode = await Location.findOne({
      where: {
        location_code: location_code,
      },
    });

    const existingTown = await Location.findOne({
      where: {
        town: town,
      },
    });

    if (existingLocationCode || existingTown) {
      const existingEntities = [];
      if (existingLocationCode) existingEntities.push("location code");
      if (existingTown) existingEntities.push("town");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(`The ${existingEntitiesString} already exists.`);
      error.status = 409;
      throw error;
    }

    const newLocation = await Location.create(req.body);
    logConfig.info("Location successfully created in the database.");
    res.status(201).json(newLocation);
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  const { location_code, town, province } = req.body;

  try {
    // Check first if the location exists
    const location = await Location.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!location) {
      const error = new Error(`Location with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if location code or town is already taken
    const existingLocationCode = await Location.findOne({
      where: {
        location_code: location_code,
        id: { [Op.ne]: req.params.id },
      },
    });

    const existingTown = await Location.findOne({
      where: {
        town: town,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingLocationCode || existingTown) {
      const existingEntities = [];
      if (existingLocationCode) existingEntities.push("location code");
      if (existingTown) existingEntities.push("town");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(`The ${existingEntitiesString} already exists.`);
      error.status = 409;
      throw error;
    }

    // Perform update if location is found
    if (location_code || town || province) {
      await Location.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedLocation = await Location.findByPk(req.params.id);

      if (!updatedLocation) {
        const error = new Error(
          `Location with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Location with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedLocation);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    // Check first if the location exists
    const location = await Location.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!location) {
      const error = new Error(
        `Location with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if location is in use before deleting
    const locationInUse = await Cave.findOne({
      where: {
        location_id: req.params.id,
      },
    });

    if (locationInUse) {
      const error = new Error("Location is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Location.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Location with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Location successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  getLocationByKeyword,
  createLocation,
  updateLocation,
  deleteLocation,
};
