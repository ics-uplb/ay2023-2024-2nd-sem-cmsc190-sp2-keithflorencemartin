import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const SampleContext = createContext();

export const SampleProvider = ({ children }) => {
  const [samples, setSamples] = useState([]);
  useEffect(() => {
    const fetchSamples = async () => {
      const samples = await getAll("sample", accessToken);
      setSamples(samples);
    };
    fetchSamples();
  }, []);

  const updateSampleInState = (updatedSample) => {
    setSamples((prevSamples) =>
      prevSamples.map((sample) =>
        sample.id === updatedSample.id ? updatedSample : sample
      )
    );
  };

  const addSampleToState = (newSample) => {
    setSamples((prevSamples) => [...prevSamples, newSample]);
  };

  const sampleTypeMap = {};
  samples.forEach((sample) => {
    sampleTypeMap[sample.id] = sample.sample_type;
  });

  const uniqueSampleTypes = Array.from(
    new Set(samples.map((sample) => sample.sample_type))
  );
  const uniqueSamples = uniqueSampleTypes.map((sample_type) => ({
    label: sample_type,
    value: sample_type,
  }));

  return (
    <SampleContext.Provider
      value={{ samples, sampleTypeMap, uniqueSamples, updateSampleInState, addSampleToState }}
    >
      {children}
    </SampleContext.Provider>
  );
};
