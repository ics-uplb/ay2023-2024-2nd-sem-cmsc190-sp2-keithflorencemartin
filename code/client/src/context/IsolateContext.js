import React, { createContext, useState, useEffect } from "react";
import { getAllIsolates } from "../utils/api/getApi";
import { getCookie } from "../utils/cookieUtils";

const accessToken = getCookie("sessionToken");

export const IsolateContext = createContext();

export const IsolateProvider = ({ children }) => {
  const [isolates, setIsolates] = useState([]);
  const [isolateTotal, setIsolateTotal] = useState(0);
  const [limitedIsolatesTotal, setLimitedIsolatesTotal] = useState(0);
  const [restrictedIsolatesTotal, setRestrictedIsolatesTotal] = useState(0);
  const [uniqueCaveIdCount, setUniqueCaveIdCount] = useState(0);

  useEffect(() => {
    const fetchIsolates = async () => {
      const isolates = await getAllIsolates(accessToken);
      setIsolates(isolates.isolates);
      setIsolateTotal(isolates.total);
      setLimitedIsolatesTotal(isolates.limitedIsolatesTotal);
      setRestrictedIsolatesTotal(isolates.restrictedIsolatesTotal);

      const uniqueCaveIds = new Set(
        isolates.isolates.map((isolate) => isolate.cave_id)
      );
      setUniqueCaveIdCount(uniqueCaveIds.size);
    };
    fetchIsolates();
  }, []);

  return (
    <IsolateContext.Provider
      value={{
        isolates,
        isolateTotal,
        limitedIsolatesTotal,
        restrictedIsolatesTotal,
        uniqueCaveIdCount,
      }}
    >
      {children}
    </IsolateContext.Provider>
  );
};
