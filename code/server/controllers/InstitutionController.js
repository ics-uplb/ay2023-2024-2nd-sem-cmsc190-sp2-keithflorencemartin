const Institution = require("../models/Institution");
const Isolate = require("../models/IsolateInfo.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllInstitutions = async (req, res, next) => {
  try {
    const institutions = await Institution.findAll();
    if (!institutions || institutions.length === 0) {
      //Handle empty result
      logConfig.info("No institutions found in the database.");
      res.status(204).json(institutions);
    } else {
      logConfig.info("Retrieved all institutions from the database.");
      res.status(200).json(institutions);
    }
  } catch (error) {
    next(error);
  }
};

const createInstitution = async (req, res, next) => {
  const { institution_code, institution_name } = req.body;

  // Check for missing required fields
  if (!institution_code || !institution_name) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check if institution code or name is already taken
    const existingInstitutionCode = await Institution.findOne({
      where: {
        institution_code: institution_code,
      },
    });

    const existingInstitutionName = await Institution.findOne({
      where: {
        institution_name: institution_name,
      },
    });

    if (existingInstitutionCode || existingInstitutionName) {
      const existingEntities = [];
      if (existingInstitutionCode) existingEntities.push("code");
      if (existingInstitutionName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Institution ${existingEntitiesString} already exists.`
      );
      error.status = 400;
      throw error;
    }

    const newInstitution = await Institution.create(req.body);
    logConfig.info("Institution created in the database.");
    res.status(201).json(newInstitution);
  } catch (error) {
    next(error);
  }
};

const updateInstitution = async (req, res, next) => {
  const { institution_code, institution_name } = req.body;

  try {
    // Check first if the location exists
    const institution = await Institution.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!institution) {
      const error = new Error(
        `Institution with ID ${req.params.id} not found.`
      );
      error.status = 404;
      throw error;
    }

    // Check if institution code or name is already taken
    const existingInstitutionCode = await Institution.findOne({
      where: {
        institution_code: institution_code,
        id: { [Op.ne]: req.params.id },
      },
    });

    const existingInstitutionName = await Institution.findOne({
      where: {
        institution_name: institution_name,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (existingInstitutionCode || existingInstitutionName) {
      const existingEntities = [];
      if (existingInstitutionCode) existingEntities.push("code");
      if (existingInstitutionName) existingEntities.push("name");

      const existingEntitiesString = existingEntities.join(" and ");

      const error = new Error(
        `Institution ${existingEntitiesString} already exists.`
      );
      error.status = 404;
      throw error;
    }

    // Perform update if location is found
    if (institution_code || institution_name) {
      await Institution.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // Update IsolateInfo accession_no if institution_code is updated
      if (institution_code) {
        const isolates = await Isolate.findAll({
          where: {
            institution_id: req.params.id,
          },
        });

        const updatePromises = isolates.map(async (isolate) => {
          const parts = isolate.accession_no.split("-");
          parts[1] = institution_code;
          const newAccessionNo = parts.join("-");

          return Isolate.update(
            { accession_no: newAccessionNo },
            { where: { id: isolate.id } }
          );
        });

        await Promise.all(updatePromises);
      }

      const updatedInstitution = await Institution.findByPk(req.params.id);

      if (!updatedInstitution) {
        const error = new Error(
          `Institution with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(
        `Institution with ID ${req.params.id} updated in the database.`
      );
      res.status(200).json(updatedInstitution);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteInstitution = async (req, res, next) => {
  try {
    // Check first if institution exists
    const institution = await Institution.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!institution) {
      const error = new Error(
        `Institution with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    // Check first if institution is in use before deleting
    const institutionInUse = await Isolate.findOne({
      where: {
        institution_id: req.params.id,
      },
    });

    if (institutionInUse) {
      const error = new Error("Institution is in use. Cannot delete.");
      error.status = 400;
      throw error;
    }

    await Institution.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(
      `Institution with ID ${req.params.id} deleted from the database.`
    );
    res.status(200).json({
      message: "Institution successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
