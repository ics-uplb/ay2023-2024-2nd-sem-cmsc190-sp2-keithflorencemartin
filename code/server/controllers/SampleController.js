const Isolate = require("../models/IsolateInfo.js");
const Sample = require("../models/Sample.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllSamples = async (req, res, next) => {
  try {
    const samples = await Sample.findAll();
    if (!samples || samples.length === 0) {
      //Handle empty result
      logConfig.info("No samples found in the database.");
      res.status(204).json(samples);
    } else {
      logConfig.info("Retrieved all samples from the database.");
      res.status(200).json(samples);
    }
  } catch (error) {
    next(error);
  }
};

const getSampleById = async (req, res, next) => {
  try {
    const sample = await Sample.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!sample || sample.length === 0) {
      const error = new Error(`Sample with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved sample with ID ${req.params.id} from the database.`
    );
    res.status(200).json(sample);
  } catch (error) {
    next(error);
  }
};

const getSampleByKeyword = async (req, res, next) => {
  const { sample } = req.query;

  try {
    if (!sample) {
      const error = new Error("'sample' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await Sample.findAll({
      where: {
        sample_type: { [Op.like]: `%${sample}%` },
      },
    });

    logConfig.info(
      `Retrieved samples based on search parameters: ${JSON.stringify({
        sample,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createSample = async (req, res, next) => {
  const { sample_type } = req.body;

  // Check for missing required fields
  if (!sample_type) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if sample type is already taken
    const existingSampleType = await Sample.findOne({
      where: {
        sample_type: sample_type,
      },
    });

    if (existingSampleType) {
      const error = new Error(`Sample type already exists.`);
      error.status = 400;
      throw error;
    }

    const newSample = await Sample.create(req.body);
    logConfig.info("Sample created in the database.");
    res.status(201).json(newSample);
  } catch (error) {
    next(error);
  }
};

const updateSample = async (req, res, next) => {
  const { sample_type } = req.body;

  try {
    // Check first if the sample exists
    const sample = await Sample.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!sample) {
      const error = new Error(`Sample with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if sample type is already taken
    const existingSampleType = await Sample.findOne({
      where: {
        sample_type: sample_type,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingSampleType) {
      const error = new Error(`Sample type already exists.`);
      error.status = 404;
      throw error;
    }

    // Perform update if sample is found
    if (sample_type) {
      await Sample.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedSample = await Sample.findByPk(req.params.id);

      if (!updatedSample) {
        const error = new Error(
          `Sample with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Sample with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedSample);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteSample = async (req, res, next) => {
  try {
    // Check first if the sample exists
    const sample = await Sample.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!sample) {
      const error = new Error(
        `Sample with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if sample is in use before deleting
    const sampleInUse = await Isolate.findOne({
      where: {
        sample_id: req.params.id,
      },
    });

    if (sampleInUse) {
      const error = new Error("Sample is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Sample.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Sample with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Sample Deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSamples,
  getSampleById,
  getSampleByKeyword,
  createSample,
  updateSample,
  deleteSample,
};
