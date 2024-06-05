export const sharedTypeConfig = {
  height: 150,
  angleField: "value",
  colorField: "type",
  radius: 0.8,
  label: {
    text: (d) => `${d.type}\n ${d.value}`,
    position: "outside",
  },
  legend: {
    color: {
      title: false,
      position: "right",
      rowPadding: 5,
    },
  },
};

export const sharedConfig = {
  xField: "type",
  yField: "value",
};

const getLocationProvince = (caveName, caves, locations) => {
  const cave = caves.find((cave) => cave.cave_name === caveName);
  if (cave && cave.location_id) {
    const location = locations.find(
      (location) => location.id === cave.location_id
    );
    if (location && location.province) {
      return location.province;
    }
  }
  return "Unknown";
};

export const countIsolates = (
  isolates,
  caves,
  locations,
  organisms,
  samples,
  setGraphData
) => {
  const provinceIsolateCount = {};
  const caveIsolateCount = {};
  const organismIsolateCount = {};
  const sampleIsolateCount = {};

  isolates.length > 0 &&
    isolates.forEach((isolate) => {
      // Count isolates by province
      const cave = caves.find((cave) => cave.id === isolate.cave_id);
      if (cave && cave.location_id) {
        const location = locations.find(
          (location) => location.id === cave.location_id
        );
        if (location && location.province) {
          const provinceName = `${location.province}`;
          provinceIsolateCount[provinceName] =
            (provinceIsolateCount[provinceName] || 0) + 1;
        }
      }

      // Count isolates by cave
      const caveName = cave?.cave_name;
      if (caveName) {
        caveIsolateCount[caveName] = (caveIsolateCount[caveName] || 0) + 1;
      }

      // Count isolates by organism type
      const organism = organisms.find(
        (organism) => organism.id === isolate.organism_id
      );
      if (organism) {
        const organismName = `${organism.organism_type}`;
        organismIsolateCount[organismName] =
          (organismIsolateCount[organismName] || 0) + 1;
      }

      // Count isolates by sample type
      const sample = samples.find((sample) => sample.id === isolate.sample_id);
      if (sample) {
        const sampleName = `${sample.sample_type}`;
        sampleIsolateCount[sampleName] =
          (sampleIsolateCount[sampleName] || 0) + 1;
      }
    });

  const provinceData = Object.entries(provinceIsolateCount).map(
    ([type, value]) => ({ type, value })
  );
  const caveData = Object.entries(caveIsolateCount).map(([type, value]) => ({
    type,
    value,
    province: getLocationProvince(type, caves, locations),
  }));
  const organismData = Object.entries(organismIsolateCount).map(
    ([type, value]) => ({ type, value })
  );
  const sampleData = Object.entries(sampleIsolateCount).map(
    ([type, value]) => ({ type, value })
  );

  setGraphData({
    province: provinceData,
    cave: caveData,
    organism: organismData,
    sample: sampleData,
  });
};
