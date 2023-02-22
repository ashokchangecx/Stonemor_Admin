import React, { useEffect, useState } from "react";

const useSmLocationData = () => {
  const [smLocations, setSmLocations] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [error, setError] = useState(null);

  const getAllLocationData = async () => {
    try {
      setLoadingLocation(true);
      let url = "https://stonemor-jrni-zudy-mock-api.vercel.app/smlocation";
      let allData = [];
      let offset = 0;
      let limit = 100;
      while (true) {
        const response = await fetch(
          `${url}?$offset=${offset}&$limit=${limit}`
        );
        const data = await response.json();
        if (data?.items?.length === 0) {
          break;
        }
        allData = [...allData, ...data?.items];
        offset += limit;
      }
      setSmLocations(allData);
      setLoadingLocation(false);
    } catch (e) {
      setError("Failed to fetch StoneMor location");
      setLoadingLocation(false);
    }
  };
  useEffect(() => {
    getAllLocationData();
  }, []);
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  return { loadingLocation, smLocations, error };
};

export default useSmLocationData;
