"use strict";

const hostsData = [
  { host_type: "Bat", host_genus: "Acerodon", host_species: "jubatus" },
  { host_type: "Bat", host_genus: "Emballonura", host_species: "alecto" },
  { host_type: "Bat", host_genus: "Miniopterus", host_species: "australis" },
  { host_type: "Bat", host_genus: "Saccolaimus", host_species: "saccolaimus" },
  { host_type: "Bat", host_genus: "Taphozous", host_species: "melanopogon" },
  { host_type: "Bat", host_genus: "Chaerephon", host_species: "plicata" },
  { host_type: "Bat", host_genus: "Cheiromeles", host_species: "parvidens" },
  { host_type: "Bat", host_genus: "Mops", host_species: "sarasinorum" },
  {
    host_type: "Bat",
    host_genus: "Alionycteris",
    host_species: "paucidentata",
  },
  { host_type: "Bat", host_genus: "Cynopterus", host_species: "brachyotis" },
  { host_type: "Bat", host_genus: "Dyacopterus", host_species: "spadiceus" },
  { host_type: "Bat", host_genus: "Eonycteris", host_species: "robusta" },
  { host_type: "Bat", host_genus: "Eonycteris", host_species: "spelaea" },
  { host_type: "Bat", host_genus: "Haplonycteris", host_species: "fishceri" },
  {
    host_type: "Bat",
    host_genus: "Harpyioncyteris",
    host_species: "whiteheadi",
  },
  { host_type: "Bat", host_genus: "Macroglossus", host_species: "minimus" },
  { host_type: "Bat", host_genus: "Megaerops", host_species: "wetmorei" },
  { host_type: "Bat", host_genus: "Ptenochirus", host_species: "jagori" },
  { host_type: "Bat", host_genus: "Ptenochirus", host_species: "minor" },
  { host_type: "Bat", host_genus: "Pteropus", host_species: "hypomelanus" },
  { host_type: "Bat", host_genus: "Pteropus", host_species: "pumilus" },
  { host_type: "Bat", host_genus: "Pteropus", host_species: "speciosus" },
  { host_type: "Bat", host_genus: "Pteropus", host_species: "vampyrus" },
  {
    host_type: "Bat",
    host_genus: "Rhinolophus",
    host_species: "amplixedectus",
  },
  { host_type: "Bat", host_genus: "Rousettus", host_species: "eschenaultia" },
  { host_type: "Bat", host_genus: "Rousettus", host_species: "leschenaultii" },
  { host_type: "Bat", host_genus: "Taphozous", host_species: "perforates" },
  { host_type: "Bat", host_genus: "Hipposideros", host_species: "cervinus" },
  { host_type: "Bat", host_genus: "Rhinolophus", host_species: "macrotis" },
  { host_type: "Bat", host_genus: "Myotis", host_species: "scotti" },
  { host_type: "Bat", host_genus: "Hipposideros", host_species: "diadema" },
  { host_type: "Bat", host_genus: "Hipposideros", host_species: "obscurus" },
  { host_type: "Bat", host_genus: "Rhinolophus", host_species: "arcuatus" },
  { host_type: "Bat", host_genus: "Rhinolophus", host_species: "inops" },
  { host_type: "Bat", host_genus: "Rhinolophus", host_species: "rufus" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("hosts", hostsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("hosts", null, {});
  },
};
