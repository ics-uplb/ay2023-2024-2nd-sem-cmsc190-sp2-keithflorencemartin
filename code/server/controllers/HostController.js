const Host = require("../models/Host.js");
const Isolate = require("../models/IsolateInfo.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllHosts = async (req, res, next) => {
  try {
    const hosts = await Host.findAll();
    if (!hosts || hosts.length === 0) {
      //Handle empty result
      logConfig.info("No hosts found in the database.");
      res.status(204).json(hosts);
    } else {
      logConfig.info("Retrieved all hosts from the database.");
      res.status(200).json(hosts);
    }
  } catch (error) {
    next(error);
  }
};

const getHostById = async (req, res, next) => {
  try {
    const host = await Host.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!host || host.length === 0) {
      const error = new Error(`Host with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved host with ID ${req.params.id} from the database.`
    );
    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
};

const getHostByKeyword = async (req, res, next) => {
  const { hostgenus } = req.query;

  try {
    if (!hostgenus) {
      const error = new Error("'hostgenus' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await Host.findAll({
      where: {
        host_genus: { [Op.like]: `%${hostgenus}%` },
      },
    });

    logConfig.info(
      `Retrieved hosts based on search parameters: ${JSON.stringify({
        hostgenus,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createHost = async (req, res, next) => {
  const { host_type, host_genus, host_species } = req.body;

  try {
    // Check for missing required fields
    if (!host_type || !host_genus || !host_species) {
      const error = new Error("Missing required fields.");
      error.status = 400;
      throw error;
    }

    // Check if host species is already taken
    const existingSpecies = await Host.findOne({
      where: {
        host_species: host_species,
      },
    });

    if (existingSpecies) {
      const error = new Error(`Host species already exists.`);
      error.status = 400;
      throw error;
    }

    const newHost = await Host.create(req.body);
    logConfig.info("Host created in the database.");
    res.status(201).json(newHost);
  } catch (error) {
    next(error);
  }
};

const updateHost = async (req, res, next) => {
  const { host_type, host_genus, host_species } = req.body;

  try {
    // Check first if the host exists
    const host = await Host.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!host) {
      const error = new Error(`Host with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if host species is already taken
    const existingSpecies = await Host.findOne({
      where: {
        host_species: host_species,
      },
    });

    if (existingSpecies) {
      const error = new Error(`Host species already exists.`);
      error.status = 400;
      throw error;
    }

    // Perform update if host is found
    if (host_type || host_genus || host_species) {
      await Host.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedHost = await Host.findByPk(req.params.id);

      if (!updatedHost) {
        const error = new Error(
          `Host with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(`Host with ID ${req.params.id} updated in the database.`);
      res.status(200).json(updatedHost);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteHost = async (req, res, next) => {
  try {
    // Check first if the host exists
    const host = await Host.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!host) {
      const error = new Error(
        `Host with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      return next(error);
    }

    // Check first if host is in use before deleting
    const hostInUse = await Isolate.findOne({
      where: {
        host_id: req.params.id,
      },
    });

    if (hostInUse) {
      const error = new Error("Host is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Host.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(`Host with ID ${req.params.id} deleted from the database.`);
    res.status(200).json({
      message: "Host successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHosts,
  getHostById,
  getHostByKeyword,
  createHost,
  updateHost,
  deleteHost,
};
