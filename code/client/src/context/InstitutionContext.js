import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const InstitutionContext = createContext();

export const InstitutionProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  useEffect(() => {
    const fetchInstitutions = async () => {
      const institutions = await getAll("institution", accessToken);
      setInstitutions(institutions);
    };
    fetchInstitutions();
  }, []);

  const updateInstitutionInState = (updatedInstitution) => {
    setInstitutions((prevInstitutions) =>
      prevInstitutions.map((institution) =>
        institution.id === updatedInstitution.id ? updatedInstitution : institution
      )
    );
  };

  const addInstitutionToState = (newInstitution) => {
    setInstitutions((prevInstitutions) => [...prevInstitutions, newInstitution]);
  };

  const uniqueInstitutionTypes = Array.from(
    new Set(institutions.map((institution) => institution.institution_name))
  );
  const uniqueInstitutions = uniqueInstitutionTypes.map((name) => ({
    label: name,
    value: name,
  }));

  return (
    <InstitutionContext.Provider value={{ institutions, uniqueInstitutions, updateInstitutionInState, addInstitutionToState }}>
      {children}
    </InstitutionContext.Provider>
  );
};
