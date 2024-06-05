import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const MethodContext = createContext();

export const MethodProvider = ({ children }) => {
  const [methods, setMethods] = useState([]);
  useEffect(() => {
    const fetchMethods = async () => {
      const methods = await getAll("method", accessToken);
      setMethods(methods);
    };
    fetchMethods();
  }, []);

  const updateMethodInState = (updatedMethod) => {
    setMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === updatedMethod.id ? updatedMethod : method
      )
    );
  };

  const addMethodToState = (newMethod) => {
    setMethods((prevMethods) => [...prevMethods, newMethod]);
  };

  const uniqueMethodTypes = Array.from(
    new Set(methods.map((method) => method.method))
  );
  const uniqueMethods = uniqueMethodTypes.map((method) => ({
    label: method,
    value: method,
  }));

  return (
    <MethodContext.Provider
      value={{ methods, uniqueMethods, updateMethodInState, addMethodToState }}
    >
      {children}
    </MethodContext.Provider>
  );
};
