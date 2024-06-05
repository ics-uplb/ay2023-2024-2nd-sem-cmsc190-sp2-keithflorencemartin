import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Upload,
} from "antd";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { HostContext } from "../../context/HostContext";
import { LocationContext } from "../../context/LocationContext";
import { MethodContext } from "../../context/MethodContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { InstitutionContext } from "../../context/InstitutionContext";
import { CollectionContext } from "../../context/CollectionContext";
import {
  getNameTaxonomyLabels,
  handleLowercase,
  handleCapitalize,
} from "../../utils/isolateUtils";
import { useUser } from "../../context/UserContext";
import { setSelectOptions } from "../../utils/isolateUtils";
import { createIsolate } from "../../utils/api/createApi";
import { getCookie } from "../../utils/cookieUtils";
import Error from "../Error/Error";
import "./Isolate.css";

const { Option } = Select;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CreateIsolate = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const { user } = useUser();
  const [form] = Form.useForm();
  const { uniqueHosts, uniqueHostGenusSpecies } = useContext(HostContext);
  const { uniqueDescriptions, uniqueCaves } = useContext(LocationContext);
  const { uniqueMethods } = useContext(MethodContext);
  const { uniqueOrganisms } = useContext(OrganismContext);
  const { uniqueSamples } = useContext(SampleContext);
  const { uniqueInstitutions } = useContext(InstitutionContext);
  const { uniqueCollections } = useContext(CollectionContext);
  const [nameTaxonomyLabels, setNameTaxonomyLabels] = useState([{}]);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [options, setOptions] = useState({});
  const [isolateProperties, setIsolateProperties] = useState({});
  const accessToken = getCookie("sessionToken");

  useEffect(() => {
    if (!authenticated) {
      return <Error type={401} />;
    }
  });

  const orderedKeys = [
    "isolate_domain",
    "isolate_phylum",
    "isolate_class",
    "isolate_order",
    "isolate_family",
    "genus",
    "species",
    "access_level",
    "organism_type",
    "sample_type",
    "method",
    "host_type",
    "host_genus_species",
    "cave_name",
    "description",
    "institution_name",
    "collection_name",
  ];

  const fieldLabels = {
    isolate_domain: "Domain",
    isolate_phylum: "Phylum",
    isolate_class: "Class",
    isolate_order: "Order",
    isolate_family: "Family",
    genus: "Genus",
    species: "Species",
    organism_type: "Organism Type",
    sample_type: "Sample Type",
    host_type: "Host Type",
    host_genus_species: "Host Genus/Species",
    method: "Analysis Method",
    institution_name: "Institution",
    collection_name: "Collection",
    cave_name: "Cave",
    description: "Description",
    access_level: "Access Level",
  };

  useEffect(() => {
    const data = getNameTaxonomyLabels();
    setNameTaxonomyLabels(data);
  }, [setNameTaxonomyLabels]);

  const firstTaxonomyGroup = nameTaxonomyLabels.slice(0, 3);
  const secondTaxonomyGroup = nameTaxonomyLabels.slice(3);

  useEffect(() => {
    const fields = [
      { key: "description", values: uniqueDescriptions },
      { key: "cave", values: uniqueCaves },
      { key: "host", values: uniqueHosts },
      { key: "hostGenusSpecies", values: uniqueHostGenusSpecies },
      { key: "method", values: uniqueMethods },
      { key: "organism", values: uniqueOrganisms },
      { key: "sample", values: uniqueSamples },
      { key: "institution", values: uniqueInstitutions },
      { key: "collection", values: uniqueCollections },
    ];

    setOptions(setSelectOptions(fields));
  }, [
    uniqueCaves,
    uniqueDescriptions,
    uniqueHosts,
    uniqueHostGenusSpecies,
    uniqueMethods,
    uniqueOrganisms,
    uniqueSamples,
    uniqueInstitutions,
    uniqueCollections,
    form,
  ]);

  const accessLevelOptions =
    authenticated && user && user.role_name === "Admin"
      ? ["Restricted", "Limited", "Public"]
      : ["Limited", "Public"];

  const openConfirmCreate = (values) => {
    setIsolateProperties(values);
    setConfirmCreate(true);
  };

  const closeConfirmCreate = () => {
    setConfirmCreate(false);
    setIsolateProperties({});
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Isolate successfully created",
    });
  };

  const createError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  const uploadImage = async (isolateId, file) => {
    try {
      if (!(file instanceof File)) {
        console.error("Invalid file object:", file);
        throw new Error("Invalid file object. Expected a File instance.");
      }

      const formData = new FormData();
      formData.append("image", file);

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        `${backendUrl}/image/upload/${isolateId}`,
        formData,
        config
      );

      success();
    } catch (error) {
      console.log("Error in creating isolate, upload image:", error);
      createError(error);
      throw error;
    }
  };

  const handleCreateIsolate = async (values) => {
    setLoadingCreate(true);
    try {
      const [host_genus, host_species] = values.host_genus_species.split(" ");
      values.host_genus = host_genus;
      values.host_species = host_species;

      const newIsolate = await createIsolate(accessToken, values);

      if (newIsolate && values.imageFile) {
        await uploadImage(newIsolate.id, values.imageFile.file);
      }

      navigate(`/isolate/${newIsolate.id}`);
      setIsolateProperties({});
    } catch (error) {
      console.log("Error in creating isolate:", error);
      createError(error);
      setConfirmCreate(false);
    }
    setLoadingCreate(false);
  };

  return (
    <div className="isolate-wrapper create">
      {contextHolder}
      <Form form={form} autoComplete="off">
        <div className="isolate-actions-section">
          <div
            className="isolate-back-direction"
            onClick={() => navigate("/advsearch")}
          >
            <LeftOutlined className="isolate-back-arrow" />
            <span className="isolate-back-text">Isolates</span>
          </div>
          <Space
            className="isolate-actions"
            style={{ display: authenticated ? "flex" : "none" }}
          >
            <Form.Item className="isolate-form-submit">
              <Button
                type="primary"
                size="large"
                className="isolate-actions-save create"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => openConfirmCreate(values))
                    .catch((error) => console.log(error));
                }}
              >
                Create Isolate
              </Button>
            </Form.Item>
          </Space>
        </div>
        <Modal
          className="isolate-delete-modal"
          centered
          open={confirmCreate}
          onCancel={closeConfirmCreate}
          closable={false}
          width={500}
          footer={[
            <Button
              className="isolate-delete-modal-btn isolate-cancel"
              key="back"
              onClick={closeConfirmCreate}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              className="isolate-save-btn"
              loading={loadingCreate}
              htmlType="submit"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => handleCreateIsolate(values))
                  .catch((error) => console.log(error));
              }}
            >
              Create
            </Button>,
          ]}
        >
          <Space
            className="modal-wrapper create"
            direction="vertical"
            align="center"
          >
            <span className="modal-title create">Confirm Isolate Creation</span>
            <div className="modal-desc">
              <Divider className="users-top-divider" />
              <span>
                You are about to create a new isolate with the following
                details:
              </span>
              <div className="create-isolate-details-container">
                <ul className="create-isolate-details">
                  {orderedKeys.map((key) => (
                    <li key={key}>
                      <strong>{fieldLabels[key] || key}:</strong>{" "}
                      {fieldLabels[key] === "Genus" ||
                      fieldLabels[key] === "Species" ||
                      fieldLabels[key] === "Host Genus" ||
                      fieldLabels[key] === "Host Genus/Species" ||
                      fieldLabels[key] === "Host Species" ? (
                        <i>{isolateProperties[key]}</i>
                      ) : (
                        isolateProperties[key]
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <Divider className="users-top-divider" />
            </div>
          </Space>
        </Modal>
        <Card className="isolate-card">
          <div className="isolate-header">
            <span className="isolate-name"></span>
            <div className="isolate-access-level-container create">
              <span className="isolate-row-key access-level create">
                Access Level
              </span>
              <Form.Item
                name={"access_level"}
                className="isolate-access-level-editing create"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <Select placeholder="Select an access level">
                  {accessLevelOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="create-isolate-upload-container">
              <Form.Item
                name="imageFile"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Upload
                  name="file"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={(file) => {
                    form.setFieldsValue({ imageFile: file });
                    return false;
                  }}
                  onRemove={() => {
                    form.setFieldsValue({ imageFile: null });
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </div>

            <Divider className="isolate-header-divider" />
          </div>
          <div className="isolate-body-row-first create">
            <div className="isolate-sections create">
              <div className="isolate-titles header name-taxonomy create">
                <span>Name and Taxonomic Classification</span>
              </div>

              <div className="isolate-sections-rows">
                <div className="isolate-name-taxonomy-group">
                  <div className="isolate-sections-data create">
                    <span className="isolate-row-key name-taxonomy">
                      Organism Type
                    </span>
                    <Form.Item
                      className="isolate-sections-create"
                      name={"organism_type"}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <Select placeholder="Select an organism type">
                        {options.organismOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  {firstTaxonomyGroup.map((item, index) => (
                    <div key={index} className="isolate-sections-data create">
                      <span className="isolate-row-key name-taxonomy">
                        {item.label}
                      </span>
                      <Form.Item
                        className="isolate-sections-create"
                        name={item.key}
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter isolate's ${
                            item.label ? item.label.toLowerCase() : ""
                          }`}
                          onChange={(event) => {
                            handleCapitalize(event, form, item.key);
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
                <div className="second-taxonomy-group">
                  {secondTaxonomyGroup.map((item, index) => (
                    <div key={index} className="isolate-sections-data create">
                      <span className="isolate-row-key name-taxonomy">
                        {item.label}
                      </span>
                      <Form.Item
                        className="isolate-sections-create"
                        name={item.key}
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter isolate's ${
                            item.label ? item.label.toLowerCase() : ""
                          }`}
                          onChange={(event) => {
                            if (item.key === "species") {
                              handleLowercase(event, form, item.key);
                            } else {
                              handleCapitalize(event, form, item.key);
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="isolate-sections isolation-environmental create">
            <div className="isolate-titles header isolation-environental create">
              <span>Isolation, Sampling, and Environmental Information</span>
            </div>
            <Space className="isolate-sections-rows" direction="vertical">
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Sample type/isolated from
                </div>
                <Form.Item
                  name={"sample_type"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a sample type"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.sampleOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Analysis Method
                </div>
                <Form.Item
                  name={"method"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow create"
                    placeholder="Select an analysis method"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.methodOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Host
                </div>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Type
                </div>
                <Form.Item
                  name={"host_type"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a host type"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.hostOptions}
                  </Select>
                </Form.Item>
              </div>

              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Genus/Species
                </div>
                <Form.Item
                  name={"host_genus_species"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a host genus/species"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.hostGenusSpeciesOptions}
                  </Select>
                </Form.Item>
              </div>
              <hr className="isolate-row-divider" />
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Sampling Point
                </div>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Cave
                </div>
                <Form.Item
                  name={"cave_name"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a cave"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.caveOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Description
                </div>
                <Form.Item
                  name={"description"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a description"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.descriptionOptions}
                  </Select>
                </Form.Item>
              </div>
              <hr className="isolate-row-divider" />
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Institution
                </div>
                <Form.Item
                  name={"institution_name"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select an institution"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.institutionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Collection
                </div>
                <Form.Item
                  name={"collection_name"}
                  className="isolate-list-value"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select
                    className="isolate-list-value overflow"
                    placeholder="Select a collection"
                    dropdownStyle={{ minWidth: "60%" }}
                    placement="bottomRight"
                  >
                    {options.collectionOptions}
                  </Select>
                </Form.Item>
              </div>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default CreateIsolate;
