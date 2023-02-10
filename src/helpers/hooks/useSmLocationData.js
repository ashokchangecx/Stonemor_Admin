import React, { useEffect, useState } from "react";

const useSmLocationData = () => {
  const [smLocations, setSmLocations] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const getAllLocationData = async () => {
    setLoadingLocation(true);
    let url = "https://stonemor-jrni-zudy-mock-api.vercel.app/smlocation";
    let allData = [];
    let offset = 0;
    let limit = 100;
    while (true) {
      const response = await fetch(`${url}?$offset=${offset}&$limit=${limit}`);
      const data = await response.json();
      if (data?.items?.length === 0) {
        break;
      }
      allData = [...allData, ...data?.items];
      offset += limit;
    }

    setSmLocations(allData);
    setLoadingLocation(false);
    // return allData;
  };
  useEffect(() => {
    getAllLocationData();
  }, []);
  return { loadingLocation, smLocations };
};

export default useSmLocationData;
