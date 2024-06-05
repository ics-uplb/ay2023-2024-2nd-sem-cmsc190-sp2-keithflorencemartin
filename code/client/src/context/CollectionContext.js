import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    const fetchCollections = async () => {
      const collections = await getAll("collection", accessToken);
      setCollections(collections);
    };
    fetchCollections();
  }, []);

  const updateCollectionInState = (updatedCollection) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection) =>
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    );
  };

  const addCollectionToState = (newCollection) => {
    setCollections((prevCollections) => [...prevCollections, newCollection]);
  };

  const uniqueCollectionTypes = Array.from(
    new Set(collections.map((collection) => collection.collection_name))
  );
  const uniqueCollections = uniqueCollectionTypes.map((name) => ({
    label: name,
    value: name,
  }));

  return (
    <CollectionContext.Provider
      value={{ collections, uniqueCollections, updateCollectionInState, addCollectionToState }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
