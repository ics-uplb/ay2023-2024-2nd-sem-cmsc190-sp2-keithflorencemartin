const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");
const Institution = require("./Institution.js");
const Cave = require("./Cave.js");
const Collection = require("./Collection.js");
const Sample = require("./Sample.js");
const Organism = require("./Organism.js");
const Host = require("./Host.js");
const SamplingPoint = require("./SamplingPoint.js");
const Method = require("./Method.js");

const IsolateInfo = db.define(
  "IsolateInfo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accession_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    genus: {
      type: DataTypes.STRING,
    },
    species: {
      type: DataTypes.STRING,
    },
    isolate_domain: {
      type: DataTypes.STRING,
    },
    isolate_phylum: {
      type: DataTypes.STRING,
    },
    isolate_class: {
      type: DataTypes.STRING,
    },
    isolate_order: {
      type: DataTypes.STRING,
    },
    isolate_family: {
      type: DataTypes.STRING,
    },
    organism_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sample_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cave_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sampling_point_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    institution_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_ref: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    access_level: {
      type: Sequelize.STRING,
    },
  },

  {
    tableName: "isolate_infos",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

// Hooks
IsolateInfo.afterCreate(async (isolate, options) => {
  const organism = await Organism.findOne({
    where: {
      id: isolate.organism_id,
    },
  });

  if (organism) {
    isolate.code = organism.value + isolate.id;
  }

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
    isolate.accession_no = `${collection.collection_code}-${institution.institution_code}-${isolate.code}`;
    await isolate.save();
  }
});

IsolateInfo.belongsTo(Method, {
  foreignKey: "method_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Institution, {
  foreignKey: "institution_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Collection, {
  foreignKey: "collection_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Sample, {
  foreignKey: "sample_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Organism, {
  foreignKey: "organism_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Host, {
  foreignKey: "host_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(SamplingPoint, {
  foreignKey: "sampling_point_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

IsolateInfo.belongsTo(Cave, {
  foreignKey: "cave_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

module.exports = IsolateInfo;
