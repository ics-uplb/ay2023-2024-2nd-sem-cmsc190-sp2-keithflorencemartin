export const getMetadataValues = (type) => {
  const values = [];

  switch (type) {
    case "Organism Type":
      values.fieldType = "organism_type";
      values.title = "Organism Type";
      break;
    case "Sample Type":
      values.fieldType = "sample_type";
      values.title = "Sample Type";
      break;
    case "Host":
      values.fieldType = "host_type";
      values.title = "Host Type";
      break;
    case "Analysis Method":
      values.fieldType = "method";
      values.title = "Analysis Method";
      break;
    case "Location":
      values.fieldType = "location_code";
      values.title = "Location Code";
      break;
    case "Cave":
      values.fieldType = "cave_code";
      values.title = "Cave Code";
      break;
    case "Sampling Point":
      values.fieldType = "description";
      values.title = "Sampling Point";
      break;
    case "Institution":
      values.fieldType = "institution_code";
      values.title = "Institution Code";
      break;
    case "Collection":
      values.fieldType = "collection_code";
      values.title = "Collection Code";
      break;
    default:
      values.fieldType = "";
      values.title = "";
  }

  return values;
};

export const handleUppercase = (event, form, fieldName) => {
  const value = event.target.value.toUpperCase();
  form.setFieldsValue({ [fieldName]: value });
};

export const handleCapitalized = (event, form, fieldName) => {
  const value = event.target.value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  form.setFieldsValue({ [fieldName]: value });
};
