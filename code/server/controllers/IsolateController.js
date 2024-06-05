const Isolate = require("../models/IsolateInfo.js");
const Organism = require("../models/Organism.js");
const Sample = require("../models/Sample.js");
const Host = require("../models/Host.js");
const Method = require("../models/Method.js");
const Location = require("../models/Location.js");
const Cave = require("../models/Cave.js");
const SamplingPoint = require("../models/SamplingPoint.js");
const Institution = require("../models/Institution.js");
const Collection = require("../models/Collection.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllIsolates = async (req, res, next) => {
  try {
    let whereCondition = {};

    if (!req.user) {
      // If user is not signed in, retrieve isolates with access_level set to "public"
      whereCondition = { access_level: "Public" };
    } else {
      if (req.user.role_name === "Researcher") {
        whereCondition = {
          access_level: { [Op.in]: ["Public", "Limited"] },
        };
      }
    }

    const isolates = await Isolate.findAll({
      include: [
        {
          model: Organism,
          attributes: ["organism_type"],
        },
        {
          model: Sample,
          attributes: ["sample_type"],
        },
        {
          model: Host,
          attributes: ["host_type", "host_genus", "host_species"],
        },
        {
          model: Method,
          attributes: ["method"],
        },
        {
          model: SamplingPoint,
          attributes: ["description"],
        },
        {
          model: Cave,
          attributes: ["cave_code", "cave_name"],
          include: [
            {
              model: Location,
              attributes: ["location_code", "town", "province"],
            },
          ],
        },
        {
          model: Institution,
          attributes: ["institution_code", "institution_name"],
        },
        {
          model: Collection,
          attributes: ["collection_code", "collection_name"],
        },
      ],

      where: whereCondition,
    });

    const allIsolates = await Isolate.findAll();

    const restrictedIsolatesTotal = allIsolates.filter(
      (isolate) => isolate.access_level === "Restricted"
    ).length;

    const limitedIsolatesTotal = allIsolates.filter(
      (isolate) =>
        isolate.access_level === "Limited" || isolate.access_level === "Public"
    ).length;

    if (!isolates || isolates.length === 0) {
      // Handle empty result
      logConfig.info("No isolates found in the database.");
      res.status(204).json(isolates);
    } else {
      logConfig.info("Retrieved all isolates from the database.");
      // res.status(200).json(isolates);
      res.status(200).json({
        isolates: isolates,
        total: allIsolates.length,
        limitedIsolatesTotal: limitedIsolatesTotal,
        restrictedIsolatesTotal: restrictedIsolatesTotal,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getIsolateById = async (req, res, next) => {
  try {
    const isolate = await Isolate.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Organism,
          attributes: ["organism_type"],
        },
        {
          model: Sample,
          attributes: ["sample_type"],
        },
        {
          model: Host,
          attributes: ["host_type", "host_genus", "host_species"],
        },
        {
          model: Method,
          attributes: ["method"],
        },
        {
          model: SamplingPoint,
          attributes: ["description"],
        },
        {
          model: Cave,
          attributes: ["cave_code", "cave_name"],
          include: [
            {
              model: Location,
              attributes: ["location_code", "town", "province"],
            },
          ],
        },
        {
          model: Institution,
          attributes: ["institution_code", "institution_name"],
        },
        {
          model: Collection,
          attributes: ["collection_code", "collection_name"],
        },
      ],
    });

    if (!isolate) {
      // If the isolate is not found
      const error = new Error(`Isolate with ID ${req.params.id} not found.`);
      error.status = 404; // Not Found
      throw error;
    }

    if (!req.user && isolate.access_level !== "Public") {
      // If the user is not logged in and the isolate is not public
      const error = new Error(`Guest users can only access public isolates.`);
      error.status = 401; // Unauthorized
      throw error;
    }

    if (
      isolate.access_level === "Restricted" &&
      (!req.user || req.user.role_name !== "Admin")
    ) {
      // If the isolate is restricted and the user is not logged in or not an admin
      const error = new Error(
        `User does not have permission to access this isolate.`
      );
      error.status = 403; // Forbidden
      throw error;
    }

    console.log("Retrieved Isolate:", isolate);

    logConfig.info(
      `Retrieved isolate with ID ${req.params.id} from the database.`
    );
    res.status(200).json(isolate);
  } catch (error) {
    next(error);
  }
};

const getIsolateByKeyword = async (req, res, next) => {
  const { genus, species, accession_no } = req.query;

  try {
    if (!genus && !species && !accession_no) {
      const error = new Error(
        "At least one of 'genus', 'species', or 'accession_no' is required for search."
      );
      error.status = 400;
      throw error;
    }

    let whereCondition = {};
    if (genus) {
      whereCondition.genus = { [Op.like]: `%${genus}%` };
    }
    if (species) {
      whereCondition.species = { [Op.like]: `%${species}%` };
    }
    if (accession_no) {
      whereCondition.accession_no = { [Op.like]: `%${accession_no}` };
    }

    if (!req.user) {
      whereCondition.access_level = "Public";
    } else {
      if (req.user.role_name === "Researcher") {
        whereCondition.access_level = { [Op.in]: ["Public", "Limited"] };
      }
    }

    let results = await Isolate.findAll({
      where: whereCondition,
    });

    if (!req.user) {
      // Filter out non-public isolates for users who are not logged in
      results = results.filter((isolate) => isolate.access_level === "Public");
    } else {
      if (req.user.role_name === "Researcher") {
        results = results.filter(
          (isolate) =>
            isolate.access_level === "Public" ||
            isolate.access_level === "Limited"
        );
      }
    }

    if (accession_no && results.length === 0) {
      const error = new Error("Isolate with accession number not found.");
      error.status = 400;
      throw error;
    }

    logConfig.info(
      `Retrieved isolates based on search parameters: ${JSON.stringify({
        genus,
        species,
      })}. Found ${results.length} results.`
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createIsolate = async (req, res, next) => {
  try {
    const {
      genus,
      species,
      isolate_domain,
      isolate_phylum,
      isolate_class,
      isolate_order,
      isolate_family,
      organism_type,
      sample_type,
      host_type,
      host_genus,
      host_species,
      method,
      institution_name,
      collection_name,
      cave_name,
      description,
      access_level,
    } = req.body;

    // Check for missing required fields
    if (
      !genus ||
      !species ||
      !isolate_domain ||
      !isolate_phylum ||
      !isolate_class ||
      !isolate_order ||
      !isolate_family ||
      !organism_type ||
      !sample_type ||
      !host_type ||
      !host_genus ||
      !host_species ||
      !method ||
      !institution_name ||
      !collection_name ||
      !cave_name ||
      !description ||
      !access_level
    ) {
      const error = new Error("Missing required fields.");
      error.status = 400;
      throw error;
    }
    const organism = await Organism.findOne({
      where: {
        organism_type: organism_type,
      },
    });

    const sample = await Sample.findOne({
      where: {
        sample_type: sample_type,
      },
    });

    const host = await Host.findOne({
      where: {
        host_type: host_type,
        host_genus: host_genus,
        host_species: host_species,
      },
    });

    const foundMethod = await Method.findOne({
      where: {
        method: method,
      },
    });

    const cave = await Cave.findOne({
      where: {
        cave_name: { [Op.eq]: cave_name },
      },
    });

    const insti = await Institution.findOne({
      where: {
        institution_name: institution_name,
      },
    });

    const coll = await Collection.findOne({
      where: {
        collection_name: collection_name,
      },
    });

    const samplingPoint = await SamplingPoint.findOne({
      where: {
        description: description,
      },
    });

    if (
      !organism ||
      !sample ||
      !host ||
      !foundMethod ||
      !cave ||
      !insti ||
      !coll ||
      !samplingPoint
    ) {
      const missingEntities = [];
      if (!organism) missingEntities.push("Organism");
      if (!sample) missingEntities.push("Sample");
      if (!host) missingEntities.push("Host");
      if (!foundMethod) missingEntities.push("Method");
      if (!cave) missingEntities.push("Cave");
      if (!samplingPoint) missingEntities.push("Sampling Point");
      if (!insti) missingEntities.push("Institution");
      if (!coll) missingEntities.push("Collection");

      const missingEntitiesString = missingEntities.join(", ");

      const error = new Error(
        `${missingEntitiesString} not found in the database`
      );
      error.status = 404;
      throw error;
    }

    const newIsolate = await Isolate.create({
      genus,
      species,
      isolate_domain,
      isolate_phylum,
      isolate_class,
      isolate_order,
      isolate_family,
      organism_id: organism.id,
      sample_id: sample.id,
      host_id: host.id,
      method_id: foundMethod.id,
      cave_id: cave.id,
      sampling_point_id: samplingPoint.id,
      institution_id: insti.id,
      collection_id: coll.id,
      access_level,
    });

    logConfig.info("Isolate created in the database.");
    res.status(201).json({
      message: "Isolate Created.",
      data: newIsolate,
    });
  } catch (error) {
    next(error);
  }
};

const updateIsolate = async (req, res, next) => {
  try {
    const {
      genus,
      species,
      isolate_domain,
      isolate_phylum,
      isolate_class,
      isolate_order,
      isolate_family,
      organism_type,
      sample_type,
      host_species,
      method,
      cave_name,
      description,
      access_level,
    } = req.body;

    // Check if any data is provided for update
    if (
      !(
        genus ||
        species ||
        isolate_domain ||
        isolate_phylum ||
        isolate_class ||
        isolate_order ||
        isolate_family ||
        organism_type ||
        sample_type ||
        host_species ||
        method ||
        cave_name ||
        description ||
        access_level
      )
    ) {
      const error = new Error("No data provided for update.");
      error.status = 400;
      throw error;
    }

    // Check first if the isolate exists
    const isolate = await Isolate.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!isolate) {
      const error = new Error(`Isolate with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    let accession_no,
      code,
      organism_id,
      sample_id,
      host_id,
      method_id,
      cave_id,
      sampling_point_id;

    if (organism_type) {
      const organism = await Organism.findOne({
        where: {
          organism_type: { [Op.eq]: organism_type },
        },
      });

      if (!organism) {
        const error = new Error(
          `Organism with name '${organism_type}' not found.`
        );
        error.status = 404;
        throw error;
      }

      organism_id = organism.id;

      // Update code based on new organism type
      code = organism.value + isolate.id;

      // Update accession_no based on new code
      const collection = await Collection.findOne({
        where: {
          id: isolate.collection_id,
        },
      });
      const institution = await Institution.findOne({
        where: {
          id: isolate.institution_id,
        },
      });

      if (collection && institution) {
        accession_no = `${collection.collection_code}-${institution.institution_code}-${code}`;
      }
    }

    if (sample_type) {
      const sample = await Sample.findOne({
        where: {
          sample_type: { [Op.eq]: sample_type },
        },
      });

      if (!sample) {
        const error = new Error(`Sample with name '${sample_type}' not found.`);
        error.status = 404;
        throw error;
      }

      sample_id = sample.id;
    }

    if (host_species) {
      const host = await Host.findOne({
        where: {
          host_species: { [Op.eq]: host_species },
        },
      });

      if (!host) {
        const error = new Error(
          `Host with species '${host_species}' not found.`
        );
        error.status = 404;
        throw error;
      }

      host_id = host.id;
    }

    if (method) {
      const foundMethod = await Method.findOne({
        where: {
          method: { [Op.eq]: method },
        },
      });

      if (!foundMethod) {
        const error = new Error(`Method with name '${method}' not found.`);
        error.status = 404;
        throw error;
      }

      method_id = method.id;
    }

    if (cave_name) {
      const cave = await Cave.findOne({
        where: {
          cave_name: { [Op.eq]: cave_name },
        },
      });

      if (!cave) {
        const error = new Error(`Cave with name '${cave_name}' not found.`);
        error.status = 404;
        throw error;
      }

      cave_id = cave.id;
    }

    if (description) {
      const samplingPoint = await SamplingPoint.findOne({
        where: {
          description: { [Op.eq]: description },
        },
      });

      if (!samplingPoint) {
        const error = new Error(
          `Sampling point with description '${description}' not found.`
        );
        error.status = 404;
        throw error;
      }

      sampling_point_id = samplingPoint.id;
    }

    const isolateUpdate = {
      accession_no,
      code,
      genus,
      species,
      isolate_domain,
      isolate_phylum,
      isolate_class,
      isolate_order,
      isolate_family,
      organism_id,
      sample_id,
      host_id,
      method_id,
      cave_id,
      sampling_point_id,
      access_level,
    };

    await Isolate.update(isolateUpdate, {
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(`Isolate with ID ${req.params.id} updated in the database.`);
    res.status(200).json({
      message: "Isolate successfully updated.",
    });
  } catch (error) {
    next(error);
  }
};

const deleteIsolate = async (req, res, next) => {
  try {
    const { isolateIds } = req.body;

    if (!Array.isArray(isolateIds) || isolateIds.length === 0) {
      const error = new Error("No isolate IDs provided or invalid format.");
      error.status = 400; // Bad Request
      error.message = `isolateIds: ${isolateIds}`;
      throw error;
    }

    // Check if any of the isolates exist
    const isolates = await Isolate.findAll({
      where: {
        id: isolateIds,
      },
    });

    if (isolates.length !== isolateIds.length) {
      const missingIds = isolateIds.filter(
        (id) => !isolates.some((isolate) => isolate.id === id)
      );
      const error = new Error(
        `Isolate(s) with ID(s) ${missingIds.join(
          ", "
        )} not found. Cannot delete.`
      );
      error.status = 404; // Not Found
      throw error;
    }

    // Delete isolates using Promise.all to handle multiple deletions asynchronously
    await Promise.all(
      isolateIds.map(async (isolateId) => {
        await Isolate.destroy({
          where: {
            id: isolateId,
          },
        });
      })
    );

    logConfig.info(
      `Isolates with IDs ${isolateIds.join(", ")} deleted from the database.`
    );
    res.status(200).json({
      message: "Isolate/s successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIsolates,
  getIsolateById,
  getIsolateByKeyword,
  createIsolate,
  updateIsolate,
  deleteIsolate,
};
