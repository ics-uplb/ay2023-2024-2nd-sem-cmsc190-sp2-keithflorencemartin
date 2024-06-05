const Collection = require("../models/Collection");
const Isolate = require("../models/IsolateInfo.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.findAll();
    if (!collections || collections.length === 0) {
      //Handle empty result
      logConfig.info("No collections found in the database.");
      res.status(204).json(collections);
    } else {
      logConfig.info("Retrieved all collections from the database.");
      res.status(200).json(collections);
    }
  } catch (error) {
    next(error);
  }
};

const createCollection = async (req, res, next) => {
  const { collection_code, collection_name } = req.body;

  // Check for missing required fields
  if (!collection_code || !collection_name) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if collection code or name is already taken
    const existingCollectionCode = await Collection.findOne({
      where: {
        collection_code: collection_code,
      },
    });

    const existingCollectionName = await Collection.findOne({
      where: {
        collection_name: collection_name,
      },
    });

    if (existingCollectionCode || existingCollectionName) {
      const existingEntities = [];
      if (existingCollectionCode) existingEntities.push("code");
      if (existingCollectionName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Collection ${existingEntitiesString} already exists.`
      );
      error.status = 400;
      throw error;
    }

    const newCollection = await Collection.create(req.body);
    logConfig.info("Collection created in the database.");
    res.status(201).json(newCollection);
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req, res, next) => {
  const { collection_code, collection_name } = req.body;

  try {
    // Check first if the location exists
    const collection = await Collection.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!collection) {
      const error = new Error(`Collection with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if collection code or name is already taken
    const existingCollectionCode = await Collection.findOne({
      where: {
        collection_code: collection_code,
        id: { [Op.ne]: req.params.id },
      },
    });

    const existingCollectionName = await Collection.findOne({
      where: {
        collection_name: collection_name,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingCollectionCode || existingCollectionName) {
      const existingEntities = [];
      if (existingCollectionCode) existingEntities.push("code");
      if (existingCollectionName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Collection ${existingEntitiesString} already exists.`
      );
      error.status = 404;
      throw error;
    }

    // Perform update if location is found
    if (collection_code || collection_name) {
      await Collection.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // Update IsolateInfo accession_no if collection_code is updated
      if (collection_code) {
        const isolates = await Isolate.findAll({
          where: {
            collection_id: req.params.id,
          },
        });

        const updatePromises = isolates.map(async (isolate) => {
          const parts = isolate.accession_no.split("-");
          parts[0] = collection_code;
          const newAccessionNo = parts.join("-");

          return Isolate.update(
            { accession_no: newAccessionNo },
            { where: { id: isolate.id } }
          );
        });

        await Promise.all(updatePromises);
      }

      const updatedCollection = await Collection.findByPk(req.params.id);

      if (!updatedCollection) {
        const error = new Error(
          `Collection with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Collection with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedCollection);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    // Check first if collection exists
    const collection = await Collection.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!collection) {
      const error = new Error(
        `Collection with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if collection is in use before deleting
    const collectionInUse = await Isolate.findOne({
      where: {
        collection_id: req.params.id,
      },
    });

    if (collectionInUse) {
      const error = new Error("Collection is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Collection.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Collection with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Collection successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};
