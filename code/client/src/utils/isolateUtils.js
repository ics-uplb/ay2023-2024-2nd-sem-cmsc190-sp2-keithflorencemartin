import { Select } from "antd";

const { Option } = Select;

const getLocationInfo = (caves, locationMap, caveId) => {
  const cave = caves.find((c) => c.id === caveId);

  if (cave) {
    const locationId = cave.location_id;
    return locationMap[locationId];
  }
  return null;
};

export const applyFilters = (
  selectedFilters,
  filterOptions,
  isolates,
  organismTypeMap,
  sampleTypeMap,
  samplingPoints,
  caves,
  locationMap,
  setFilteredIsolates
) => {
  const selectedCategories = new Set();

  Object.entries(selectedFilters).forEach(([filter, isSelected]) => {
    if (isSelected) {
      const category = Object.keys(filterOptions).find((key) =>
        filterOptions[key].some((option) => option.label === filter)
      );

      if (
        filter === "Public" ||
        filter === "Limited" ||
        filter === "Restricted"
      ) {
        selectedCategories.add("access_levels");
      }

      if (category) {
        selectedCategories.add(category);
      }
    }
  });

  const selectedFilterKeys = Object.keys(selectedFilters).filter(
    (key) => selectedFilters[key]
  );

  let filteredData = isolates;

  if (selectedFilterKeys.length > 0) {
    filteredData = isolates.filter((isolate) => {
      const organismType = organismTypeMap[isolate.organism_id];
      const sampleType = sampleTypeMap[isolate.sample_id];
      const location = getLocationInfo(
        caves,
        locationMap,
        // isolate.sampling_point_id
        isolate.cave_id
      );
      const locationProvince = location ? location.province : null;

      const accessLevelCondition =
        selectedFilters[isolate.access_level] || !isolate.access_level;

      if (selectedCategories.size === 1) {
        return (
          (organismType && selectedFilterKeys.includes(organismType)) ||
          (sampleType && selectedFilterKeys.includes(sampleType)) ||
          (locationProvince && selectedFilterKeys.includes(locationProvince)) ||
          selectedFilters[isolate.access_level]
        );
      } else if (selectedCategories.size === 2) {
        return (
          // organism-sample
          (organismType &&
            sampleType &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(sampleType)) ||
          // organism-location
          (organismType &&
            locationProvince &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(locationProvince)) ||
          // organism-access
          (organismType &&
            accessLevelCondition &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(isolate.access_level)) ||
          // sample-location
          (sampleType &&
            locationProvince &&
            selectedFilterKeys.includes(sampleType) &&
            selectedFilterKeys.includes(locationProvince)) ||
          // sample-access
          (sampleType &&
            accessLevelCondition &&
            selectedFilterKeys.includes(sampleType) &&
            selectedFilterKeys.includes(isolate.access_level)) ||
          // location-access
          (locationProvince &&
            accessLevelCondition &&
            selectedFilterKeys.includes(locationProvince) &&
            selectedFilterKeys.includes(isolate.access_level))
        );
      } else if (selectedCategories.size === 3) {
        return (
          // organism-sample-location
          (organismType &&
            sampleType &&
            locationProvince &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(sampleType) &&
            selectedFilterKeys.includes(locationProvince)) ||
          // organism-sample-access
          (organismType &&
            sampleType &&
            accessLevelCondition &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(sampleType) &&
            selectedFilterKeys.includes(isolate.access_level)) ||
          // organism-location-access
          (organismType &&
            locationProvince &&
            accessLevelCondition &&
            selectedFilterKeys.includes(organismType) &&
            selectedFilterKeys.includes(locationProvince) &&
            selectedFilterKeys.includes(isolate.access_level)) ||
          // sample-location-access
          (sampleType &&
            locationProvince &&
            accessLevelCondition &&
            selectedFilterKeys.includes(sampleType) &&
            selectedFilterKeys.includes(locationProvince) &&
            selectedFilterKeys.includes(isolate.access_level))
        );
      } else {
        return (
          organismType &&
          sampleType &&
          locationProvince &&
          accessLevelCondition &&
          selectedFilterKeys.includes(organismType) &&
          selectedFilterKeys.includes(sampleType) &&
          selectedFilterKeys.includes(locationProvince) &&
          selectedFilterKeys.includes(isolate.access_level)
        );
      }
    });
  }
  setFilteredIsolates(filteredData);
};

export const getNameTaxonomyData = (isolate) => {
  return [
    {
      key: "isolate_domain",
      label: "Domain",
      value: `${isolate && isolate.isolate_domain}`,
    },
    {
      key: "isolate_phylum",
      label: "Phylum",
      value: `${isolate && isolate.isolate_phylum}`,
    },
    {
      key: "isolate_class",
      label: "Class",
      value: `${isolate && isolate.isolate_class}`,
    },
    {
      key: "isolate_order",
      label: "Order",
      value: `${isolate && isolate.isolate_order}`,
    },
    {
      key: "isolate_family",
      label: "Family",
      value: `${isolate && isolate.isolate_family}`,
    },
    {
      key: "genus",
      label: "Genus",
      value: `${isolate && isolate.genus}`,
    },
    {
      key: "species",
      label: "Species",
      value: `${isolate && isolate.species}`,
    },
  ];
};

export const getNameTaxonomyLabels = () => {
  return [
    {
      key: "isolate_domain",
      label: "Domain",
    },
    {
      key: "isolate_phylum",
      label: "Phylum",
    },
    {
      key: "isolate_class",
      label: "Class",
    },
    {
      key: "isolate_order",
      label: "Order",
    },
    {
      key: "isolate_family",
      label: "Family",
    },
    {
      key: "genus",
      label: "Genus",
    },
    {
      key: "species",
      label: "Species",
    },
  ];
};

const generateOptions = (options) => {
  return options.map((option) => (
    <Option key={option.value} value={option.value}>
      {option.label}
    </Option>
  ));
};

export const setSelectOptions = (uniqueDataArray) => {
  const options = {};
  uniqueDataArray.forEach((data) => {
    const key = `${data.key}Options`;
    options[key] = generateOptions(data.values);
  });
  return options;
};

export const handleLowercase = (event, form, fieldName) => {
  const value = event.target.value.toLowerCase();
  form.setFieldsValue({ [fieldName]: value });
};

export const handleCapitalize = (event, form, fieldName) => {
  const value =
    event.target.value.charAt(0).toUpperCase() +
    event.target.value.slice(1).toLowerCase();
  form.setFieldsValue({ [fieldName]: value });
};
