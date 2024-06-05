const Isolate = require("../models/IsolateInfo.js");
const Method = require("../models/Method.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllMethods = async (req, res, next) => {
  try {
    const methods = await Method.findAll();
    if (!methods || methods.length === 0) {
      //Handle empty result
      logConfig.info("No methods found in the database.");
      res.status(204).json(methods);
    } else {
      logConfig.info("Retrieved all methods from the database.");
      res.status(200).json(methods);
    }
  } catch (error) {
    next(error);
  }
};

const getMethodById = async (req, res, next) => {
  try {
    const method = await Method.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!method || method.length === 0) {
      const error = new Error(`Method with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved method with ID ${req.params.id} from the database.`
    );
    res.status(200).json(method);
  } catch (error) {
    next(error);
  }
};

const getMethodByKeyword = async (req, res, next) => {
  const { method } = req.query;

  try {
    if (!method) {
      const error = new Error("'method' is required for search.");
      error.status = 400;
      return next(error);
    }

    const results = await Method.findAll({
      where: {
        method: { [Op.like]: `%${method}%` },
      },
    });

    logConfig.info(
      `Retrieved methods based on search parameters: ${JSON.stringify({
        method,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createMethod = async (req, res, next) => {
  const { method } = req.body;

  // Check for missing required fields
  if (!method) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if method name is already taken
    const existingMethod = await Method.findOne({
      where: {
        method: method,
      },
    });

    if (existingMethod) {
      const error = new Error(`Method already exists.`);
      error.status = 404;
      throw error;
    }

    const newMethod = await Method.create(req.body);
    logConfig.info("Method created in the database.");
    res.status(201).json(newMethod);
  } catch (error) {
    next(error);
  }
};

const updateMethod = async (req, res, next) => {
  const { method } = req.body;

  try {
    // Check first if the method exists
    const existMethod = await Method.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!existMethod) {
      const error = new Error(`Method with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if method name is already taken
    const existingMethod = await Method.findOne({
      where: {
        method: method,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingMethod) {
      const error = new Error(`Method already exists.`);
      error.status = 404;
      throw error;
    }

    // Perform update if method is found
    if (method) {
      await Method.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedMethod = await Method.findByPk(req.params.id);

      if (!updatedMethod) {
        const error = new Error(
          `Method with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Method with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedMethod);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteMethod = async (req, res, next) => {
  try {
    // Check first if the method exists
    const method = await Method.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!method) {
      const error = new Error(
        `Method with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      return next(error);
    }

    // Check first if method is in use before deleting
    const methodInUse = await Isolate.findOne({
      where: {
        method_id: req.params.id,
      },
    });

    if (methodInUse) {
      const error = new Error("Analysis Method is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Method.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Method with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Method successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMethods,
  getMethodById,
  getMethodByKeyword,
  createMethod,
  updateMethod,
  deleteMethod,
};
