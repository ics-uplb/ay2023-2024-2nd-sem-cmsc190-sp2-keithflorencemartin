import React, { createContext, useEffect, useState } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [caves, setCaves] = useState([]);
  const [samplingPoints, setSamplingPoints] = useState([]);
  const [locationMap, setLocationMap] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsData = await getAll("location", accessToken);
      setLocations(locationsData);
      const map = {};
      locationsData.forEach((location) => {
        map[location.id] = location;
      });
      setLocationMap(map);
    };

    const fetchCaves = async () => {
      const cavesData = await getAll("cave", accessToken);
      setCaves(cavesData);
    };

    const fetchSamplingPoints = async () => {
      const samplingPointsData = await getAll("samplingPoint", accessToken);
      setSamplingPoints(samplingPointsData);
    };

    fetchLocations();
    fetchCaves();
    fetchSamplingPoints();
  }, []);

  const updateSamplingPointInState = (updatedSamplingPoint) => {
    setSamplingPoints((prevSamplingPoint) =>
      prevSamplingPoint.map((samplingPoint) =>
        samplingPoint.id === updatedSamplingPoint.id
          ? updatedSamplingPoint
          : samplingPoint
      )
    );
  };

  const updateLocationInState = (updatedLocation) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.id === updatedLocation.id ? updatedLocation : location
      )
    );
  };

  const updateCaveInState = (updatedCave) => {
    setCaves((prevCaves) =>
      prevCaves.map((cave) => (cave.id === updatedCave.id ? updatedCave : cave))
    );
  };

  const addSamplingPointToState = (newSamplingPoint) => {
    setSamplingPoints((prevSamplingPoints) => [...prevSamplingPoints, newSamplingPoint]);
  };

  const addLocationToState = (newLocation) => {
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  const addCaveToState = (newCave) => {
    setCaves((prevCaves) => [...prevCaves, newCave]);
  };

  const uniqueLocationCodeTypes = Array.from(
    new Set(locations.map((location) => location.location_code))
  );
  const uniqueLocationCodes = uniqueLocationCodeTypes.map((location_code) => ({
    label: location_code,
    value: location_code,
  }));

  const uniqueCaveCodeTypes = Array.from(
    new Set(caves.map((cave) => cave.cave_code))
  );
  const uniqueCaveCodes = uniqueCaveCodeTypes.map((cave_code) => ({
    label: cave_code,
    value: cave_code,
  }));

  const uniqueCaveTypes = Array.from(
    new Set(caves.map((cave) => cave.cave_name))
  );
  const uniqueCaves = uniqueCaveTypes.map((cave) => ({
    label: cave,
    value: cave,
  }));

  const uniqueTownsSet = Array.from(
    new Set(locations.map((location) => location.town))
  );
  const uniqueTowns = uniqueTownsSet.map((town) => ({
    label: town,
    value: town,
  }));

  const uniqueProvinces = Array.from(
    new Set(locations.map((location) => location.province))
  );
  const uniqueLocations = uniqueProvinces.map((province) => ({
    label: province,
    value: province,
  }));

  const uniqueDescriptionsSet = Array.from(
    new Set(samplingPoints.map((samplingPoint) => samplingPoint.description))
  );
  const uniqueDescriptions = uniqueDescriptionsSet.map((description) => ({
    label: description,
    value: description,
  }));

  return (
    <LocationContext.Provider
      value={{
        locations,
        caves,
        samplingPoints,
        locationMap,
        uniqueDescriptions,
        uniqueLocations,
        uniqueTowns,
        uniqueCaves,
        uniqueCaveCodes,
        uniqueLocationCodes,
        updateSamplingPointInState,
        updateLocationInState,
        updateCaveInState,
        addSamplingPointToState,
        addLocationToState,
        addCaveToState
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
