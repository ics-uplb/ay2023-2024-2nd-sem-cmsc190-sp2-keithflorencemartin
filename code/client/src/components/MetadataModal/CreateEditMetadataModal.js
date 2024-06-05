import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal, Select } from "antd";
import { CollectionContext } from "../../context/CollectionContext";
import { InstitutionContext } from "../../context/InstitutionContext";
import { HostContext } from "../../context/HostContext";
import { LocationContext } from "../../context/LocationContext";
import { MethodContext } from "../../context/MethodContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { handleLowercase, setSelectOptions } from "../../utils/isolateUtils";
import { createMetadata } from "../../utils/api/createApi";
import { updateMetadata } from "../../utils/api/updateApi";
import { handleCapitalized, handleUppercase } from "../../utils/metadataUtils";
import { getCookie } from "../../utils/cookieUtils";

const { TextArea } = Input;

const CreateEditMetadatModal = ({
  type,
  title,
  model,
  openEdit,
  handleCancel,
  recordToEdit,
  setFilteredData,
}) => {
  const [form] = Form.useForm();
  const {
    locations,
    updateSamplingPointInState,
    updateLocationInState,
    uniqueLocationCodes,
    updateCaveInState,
    addSamplingPointToState,
    addLocationToState,
    addCaveToState,
  } = useContext(LocationContext);
  const { updateCollectionInState, addCollectionToState } =
    useContext(CollectionContext);
  const { updateInstitutionInState, addInstitutionToState } =
    useContext(InstitutionContext);
  const { updateHostInState, addHostToState } = useContext(HostContext);
  const { updateMethodInState, addMethodToState } = useContext(MethodContext);
  const { updateOrganismInState, addOrganismToState } =
    useContext(OrganismContext);
  const { updateSampleInState, addSampleToState } = useContext(SampleContext);
  const [options, setOptions] = useState({});
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const accessToken = getCookie("sessionToken");

  useEffect(() => {
    const fields = [{ key: "locationCode", values: uniqueLocationCodes }];

    setOptions(setSelectOptions(fields));
  }, [uniqueLocationCodes]);

  useEffect(() => {
    if (recordToEdit) {
      if (title === "Cave") {
        const location = locations.find(
          (loc) => loc.id === recordToEdit.location_id
        );
        form.setFieldValue("cave_location_code", location.location_code);
      }

      const initialFormValues = {
        organism_type: recordToEdit.organism_type,
        value: recordToEdit.value,
        sample_type: recordToEdit.sample_type,
        method: recordToEdit.method,
        location_code: recordToEdit.location_code,
        town: recordToEdit.town,
        province: recordToEdit.province,
        cave_code: recordToEdit.cave_code,
        cave_name: recordToEdit.cave_name,
        host_type: recordToEdit.host_type,
        host_genus: recordToEdit.host_genus,
        host_species: recordToEdit.host_species,
        description: recordToEdit.description,
        institution_code: recordToEdit.institution_code,
        institution_name: recordToEdit.institution_name,
        collection_code: recordToEdit.collection_code,
        collection_name: recordToEdit.collection_name,
      };

      form.setFieldsValue(initialFormValues);
      setInitialValues(initialFormValues);
      setHasChanges(false);
    }
  }, [recordToEdit, form, locations, title]);

  const handleFieldsChange = (_, allFields) => {
    const currentValues = form.getFieldsValue();
    const isModified = Object.keys(currentValues).some(
      (key) => currentValues[key] !== initialValues[key]
    );
    setHasChanges(isModified);
  };

  const showUpdateSuccess = (title) => {
    messageApi.open({
      type: "success",
      content: `${title} successfully updated`,
    });
  };

  const showCreateSuccess = (title) => {
    messageApi.open({
      type: "success",
      content: `${title} successfully created`,
    });
  };

  const showError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  const handleCreateMetadata = async (values) => {
    setLoadingCreate(true);
    console.log(values);

    try {
      const newData = await createMetadata(model, accessToken, values);

      setFilteredData((prevData) => [...prevData, newData]);

      switch (model) {
        case "organism":
          addOrganismToState(newData);
          break;
        case "sample":
          addSampleToState(newData);
          break;
        case "host":
          addHostToState(newData);
          break;
        case "method":
          addMethodToState(newData);
          break;
        case "samplingPoint":
          addSamplingPointToState(newData);
          break;
        case "location":
          addLocationToState(newData);
          break;
        case "cave":
          addCaveToState(newData);
          break;
        case "institution":
          addInstitutionToState(newData);
          break;
        case "collection":
          addCollectionToState(newData);
          break;
        default:
          break;
      }

      handleCancel();
      showCreateSuccess(title);
      form.resetFields();
    } catch (error) {
      showError(error.response.data.message);
      setLoadingCreate(false);
    }

    setLoadingCreate(false);
  };

  const handleSaveMetadata = async (values) => {
    setLoadingEdit(true);

    try {
      const updatedData = await updateMetadata(
        model,
        accessToken,
        recordToEdit.id,
        values
      );

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === recordToEdit.id ? updatedData : item
        )
      );

      switch (model) {
        case "organism":
          updateOrganismInState(updatedData);
          break;
        case "sample":
          updateSampleInState(updatedData);
          break;
        case "host":
          updateHostInState(updatedData);
          break;
        case "method":
          updateMethodInState(updatedData);
          break;
        case "samplingPoint":
          updateSamplingPointInState(updatedData);
          break;
        case "location":
          updateLocationInState(updatedData);
          break;
        case "cave":
          updateCaveInState(updatedData);
          break;
        case "institution":
          updateInstitutionInState(updatedData);
          break;
        case "collection":
          updateCollectionInState(updatedData);
          break;
        default:
          break;
      }

      handleCancel();
      showUpdateSuccess(title);
    } catch (error) {
      showError(error.response.data.message);
      setLoadingEdit(false);
    }

    setLoadingEdit(false);
  };

  const handleAddCancel = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      centered
      open={openEdit}
      onCancel={() => (type === "create" ? handleAddCancel() : handleCancel())}
      footer={[
        <Button
          type="default"
          key="back"
          onClick={() =>
            type === "create" ? handleAddCancel() : handleCancel()
          }
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          key="submit"
          loading={type === "create" ? loadingCreate : loadingEdit}
          disabled={!hasChanges}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                if (type === "create") {
                  handleCreateMetadata(values);
                } else {
                  handleSaveMetadata(values);
                }
              })
              .catch((errorInfo) => {
                console.log(errorInfo);
              });
          }}
        >
          {type === "create" ? "Create" : "Save"}
        </Button>,
      ]}
    >
      {contextHolder}
      <span className="users-au-modal-title">
        {type === "create" ? "Create" : "Edit"} {title}
      </span>
      <Divider className="info-table-top-divider" />

      <Form
        form={form}
        className="info-table-form"
        onFieldsChange={handleFieldsChange}
      >
        <div className="info-table-organism-wrapper">
          {title === "Organism Type" && (
            <div>
              <div className="info-table-form-item">
                <Form.Item
                  name={"organism_type"}
                  label="Organism Type"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 17 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleCapitalized(event, form, "organism_type")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item">
                <Form.Item
                  name={"value"}
                  label="Value"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 17 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        {title === "Sample Type" && (
          <div className="info-table-form-item">
            <Form.Item
              name={"sample_type"}
              label="Sample Type"
              rules={[{ required: true, message: "" }]}
            >
              <Input
                onChange={(event) =>
                  handleCapitalized(event, form, "sample_type")
                }
              />
            </Form.Item>
          </div>
        )}

        <div className="info-table-institution-wrapper">
          {title === "Host" && (
            <div>
              <div className="info-table-form-item institution">
                <Form.Item
                  name={"host_type"}
                  label="Host Type"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleCapitalized(event, form, "host_type")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item institution">
                <Form.Item
                  name={"host_genus"}
                  label="Host Genus"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleCapitalized(event, form, "host_genus")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item institution">
                <Form.Item
                  name={"host_species"}
                  label="Host Species"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleLowercase(event, form, "host_species")
                    }
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        {title === "Analysis Method" && (
          <div className="info-table-form-item analysis-method">
            <Form.Item
              name={"method"}
              label="Analysis Method"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
          </div>
        )}

        <div className="info-table-location-wrapper">
          {title === "Location" && (
            <div>
              <div className="info-table-form-item">
                <Form.Item
                  name={"location_code"}
                  label="Location Code"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 17 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleUppercase(event, form, "location_code")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item">
                <Form.Item
                  name={"town"}
                  label="Town"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 17 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) => handleCapitalized(event, form, "town")}
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item">
                <Form.Item
                  name={"province"}
                  label="Province"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 17 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleCapitalized(event, form, "province")
                    }
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="info-table-cave-wrapper">
          {title === "Cave" && (
            <div>
              <div className="info-table-form-item cave">
                <Form.Item
                  name={"cave_code"}
                  label="Cave Code"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleUppercase(event, form, "cave_code")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item cave">
                <Form.Item
                  name={"cave_name"}
                  label="Name"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleCapitalized(event, form, "cave_name")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item cave">
                <Form.Item
                  name={"cave_location_code"}
                  label="Location Code"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Select className="info-table-form-cave-select">
                    {options.locationCodeOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        {title === "Sampling Point" && (
          <div className="info-table-form-item">
            <Form.Item
              name={"description"}
              label="Sampling Point"
              rules={[{ required: true, message: "" }]}
            >
              <TextArea
                className="info-table-form-textarea"
                autoSize={{
                  minRows: 2,
                  maxRows: 3,
                }}
              />
            </Form.Item>
          </div>
        )}

        <div className="info-table-institution-wrapper">
          {title === "Institution" && (
            <div>
              <div className="info-table-form-item institution">
                <Form.Item
                  name={"institution_code"}
                  label="Institution Code"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleUppercase(event, form, "institution_code")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item institution">
                <Form.Item
                  name={"institution_name"}
                  label="Name"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="info-table-collection-wrapper">
          {title === "Collection" && (
            <div>
              <div className="info-table-form-item collection">
                <Form.Item
                  name={"collection_code"}
                  label="Collection Code"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    onChange={(event) =>
                      handleUppercase(event, form, "collection_code")
                    }
                  />
                </Form.Item>
              </div>

              <div className="info-table-form-item collection">
                <Form.Item
                  name={"collection_name"}
                  label="Name"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 15 }}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          )}
        </div>
      </Form>
      <Divider className="info-table-bottom-divider" />
    </Modal>
  );
};

export default CreateEditMetadatModal;
