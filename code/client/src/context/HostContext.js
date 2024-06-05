import React, { createContext, useState, useEffect } from "react";
import { getAll } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const HostContext = createContext();

export const HostProvider = ({ children }) => {
  const [hosts, setHosts] = useState([]);
  useEffect(() => {
    const fetchHosts = async () => {
      const hosts = await getAll("host", accessToken);
      setHosts(hosts);
    };
    fetchHosts();
  }, []);

  const updateHostInState = (updatedHost) => {
    setHosts((prevHosts) =>
      prevHosts.map((host) => (host.id === updatedHost.id ? updatedHost : host))
    );
  };

  const addHostToState = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
  };

  const uniqueHostTypes = Array.from(
    new Set(hosts.map((host) => host.host_type))
  );
  const uniqueHosts = uniqueHostTypes.map((host) => ({
    label: host,
    value: host,
  }));

  const uniqueHostGenusSet = Array.from(
    new Set(hosts.map((host) => host.host_genus))
  );
  const uniqueHostGenus = uniqueHostGenusSet.map((host) => ({
    label: host,
    value: host,
  }));

  const uniqueHostSpeciesSet = Array.from(
    new Set(hosts.map((host) => host.host_species))
  );
  const uniqueHostSpecies = uniqueHostSpeciesSet.map((host) => ({
    label: host,
    value: host,
  }));

  const uniqueHostGenusSpeciesSet = Array.from(
    new Set(hosts.map((host) => host.host_genus + " " + host.host_species))
  );
  const uniqueHostGenusSpecies = uniqueHostGenusSpeciesSet.map((host) => ({
    label: host,
    value: host,
  }));

  return (
    <HostContext.Provider
      value={{
        hosts,
        uniqueHosts,
        uniqueHostGenus,
        uniqueHostSpecies,
        uniqueHostGenusSpecies,
        updateHostInState,
        addHostToState,
      }}
    >
      {children}
    </HostContext.Provider>
  );
};
