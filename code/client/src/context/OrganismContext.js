import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const OrganismContext = createContext();

export const OrganismProvider = ({ children }) => {
  const [organisms, setOrganisms] = useState([]);
  useEffect(() => {
    const fetchOrganisms = async () => {
      const organisms = await getAll("organism", accessToken);
      setOrganisms(organisms);
    };
    fetchOrganisms();
  }, []);

  const updateOrganismInState = (updatedOrganism) => {
    setOrganisms((prevOrganisms) =>
      prevOrganisms.map((organism) =>
        organism.id === updatedOrganism.id ? updatedOrganism : organism
      )
    );
  };

  const addOrganismToState = (newOrganism) => {
    setOrganisms((prevOrganisms) => [...prevOrganisms, newOrganism]);
  };

  const organismTypeMap = {};
  organisms.forEach((organism) => {
    organismTypeMap[organism.id] = organism.organism_type;
  });

  const uniqueOrganismTypes = Array.from(
    new Set(organisms.map((org) => org.organism_type))
  );
  const uniqueOrganisms = uniqueOrganismTypes.map((organism_type) => ({
    label: organism_type,
    value: organism_type,
  }));

  return (
    <OrganismContext.Provider
      value={{
        organisms,
        organismTypeMap,
        uniqueOrganisms,
        updateOrganismInState,
        addOrganismToState
      }}
    >
      {children}
    </OrganismContext.Provider>
  );
};
