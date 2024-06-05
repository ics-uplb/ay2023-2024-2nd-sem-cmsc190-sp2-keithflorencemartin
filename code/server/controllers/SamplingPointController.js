const Sequelize = require("sequelize");
const Isolate = require("../models/IsolateInfo.js");
const SamplingPoint = require("../models/SamplingPoint.js");
const Cave = require("../models/Cave.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllSamplingPoints = async (req, res, next) => {
  try {
    const samplingPoints = await SamplingPoint.findAll();
    if (!samplingPoints || samplingPoints.length === 0) {
      //Handle empty result
      logConfig.info("No sampling points found in the database.");
      res.status(204).json(samplingPoints);
    } else {
      logConfig.info("Retrieved all sampling points from the database.");
      res.status(200).json(samplingPoints);
    }
  } catch (error) {
    next(error);
  }
};

const getSamplingPointById = async (req, res, next) => {
  try {
    const samplingPoint = await SamplingPoint.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!samplingPoint || samplingPoint.length === 0) {
      const error = new Error(
        `Sampling point with ID ${req.params.id} not found.`
      );
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved sampling point with ID ${req.params.id} from the database.`
    );
    res.status(200).json(samplingPoint);
  } catch (error) {
    next(error);
  }
};

const getSamplingPointByKeyword = async (req, res, next) => {
  const { cave } = req.query;

  try {
    if (!cave) {
      const error = new Error("'cave' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await SamplingPoint.findAll({
      where: {
        cave_id: {
          [Op.in]: Sequelize.literal(`
                        (SELECT id FROM caves WHERE name LIKE :cave)
                    `),
        },
      },
      include: [
        {
          model: Cave,
          attributes: ["cave_code", "name"],
          where: {
            name: {
              [Op.like]: `%${cave}%`,
            },
          },
        },
      ],
      replacements: {
        cave: `%${cave}%`,
      },
      type: Sequelize.QueryTypes.SELECT,
    });

    logConfig.info(
      `Retrieved sampling points based on search parameters: ${JSON.stringify({
        cave,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createSamplingPoint = async (req, res, next) => {
  const { description } = req.body;

  // Check for missing required field
  if (!description) {
    const error = new Error("Missing required field.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if sampling point description is already taken
    const existingDescription = await SamplingPoint.findOne({
      where: {
        description: description,
      },
    });

    if (existingDescription) {
      const error = new Error("Sampling Point already exists.");
      error.status = 400;
      throw error;
    }

    const newSamplingPoint = await SamplingPoint.create(req.body);

    logConfig.info("Sampling point created in the database.");
    res.status(201).json(newSamplingPoint);
  } catch (error) {
    next(error);
  }
};

const updateSamplingPoint = async (req, res, next) => {
  const { description } = req.body;

  try {
    // Check first if the samplingPoint exists
    const samplingPoint = await SamplingPoint.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!samplingPoint) {
      const error = new Error(
        `Sampling point with ID ${req.params.id} not found.`
      );
      error.status = 404;
      throw error;
    }

    // Check if sampling point description is already taken
    const existingDescription = await SamplingPoint.findOne({
      where: {
        description: description,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingDescription) {
      const error = new Error("Sampling Point already exists.");
      error.status = 400;
      throw error;
    }

    if (description) {
      await SamplingPoint.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedSamplingPoint = await SamplingPoint.findByPk(req.params.id);

      if (!updatedSamplingPoint) {
        const error = new Error(
          `Sampling Point with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Sampling point with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedSamplingPoint);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteSamplingPoint = async (req, res, next) => {
  try {
    // Check first if the samplingPoint exists
    const samplingPoint = await SamplingPoint.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!samplingPoint) {
      const error = new Error(
        `Sampling point with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if sampling point is in use before deleting
    const samplingPointInUse = await Isolate.findOne({
      where: {
        sampling_point_id: req.params.id,
      },
    });

    if (samplingPointInUse) {
      const error = new Error("Sampling Point is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await SamplingPoint.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Sampling point with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Sampling point successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSamplingPoints,
  getSamplingPointById,
  getSamplingPointByKeyword,
  createSamplingPoint,
  updateSamplingPoint,
  deleteSamplingPoint,
};
