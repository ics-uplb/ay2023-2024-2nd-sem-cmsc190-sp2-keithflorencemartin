import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import {
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
  LeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { HostContext } from "../../context/HostContext";
import { LocationContext } from "../../context/LocationContext";
import { MethodContext } from "../../context/MethodContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { InstitutionContext } from "../../context/InstitutionContext";
import { CollectionContext } from "../../context/CollectionContext";
import { useUser } from "../../context/UserContext";
import { getIsolateById } from "../../utils/api/getApi";
import { deleteIsolate } from "../../utils/api/deleteApi";
import { updateIsolate } from "../../utils/api/updateApi";
import {
  getNameTaxonomyData,
  setSelectOptions,
  handleLowercase,
  handleCapitalize,
} from "../../utils/isolateUtils";
import { getCookie } from "../../utils/cookieUtils";
import Error from "../Error/Error";
import "./Isolate.css";

const { Option } = Select;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Isolate = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const { user } = useUser();
  const { code } = useParams();
  const [form] = Form.useForm();
  const { uniqueHosts, uniqueHostGenusSpecies } = useContext(HostContext);
  const { uniqueDescriptions, uniqueCaves } = useContext(LocationContext);
  const { uniqueMethods } = useContext(MethodContext);
  const { uniqueOrganisms } = useContext(OrganismContext);
  const { uniqueSamples } = useContext(SampleContext);
  const { uniqueInstitutions } = useContext(InstitutionContext);
  const { uniqueCollections } = useContext(CollectionContext);
  const [isolate, setIsolate] = useState(null);
  const [nameTaxonomyData, setNameTaxonomyData] = useState([{}]);
  const [loadingIsolate, setLoadingIsolate] = useState(true);
  const [confirmSave, setConfirmSave] = useState(false);
  const [deleteIsolateModalOpen, setDeleteIsolateModalOpen] = useState(false);
  const [loadingDeleteIsolate, setLoadingDeleteIsolate] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingRemoveImage, setLoadingRemoveImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteIsolateErrorMessage, setDeleteIsolateErrorMessage] =
    useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState({});
  const accessToken = getCookie("sessionToken");

  useEffect(() => {
    const fetchIsolateImage = async () => {
      if (isolate) {
        try {
          if (isolate.image_ref) {
            let imageUrl;
            imageUrl = `https://res.cloudinary.com/djcqgrisf/isolate-pictures/${isolate.image_ref}`;

            const response = await fetch(imageUrl, { method: "HEAD" });

            if (response.ok) {
              setImageUrl(imageUrl);
            } else {
              setImageUrl(null);
            }
          }
        } catch (error) {
          console.log(error);
          setImageUrl(null);
        }
      }
    };

    fetchIsolateImage();
  }, [isolate]);

  useEffect(() => {
    setLoadingIsolate(true);
    const fetchIsolate = async () => {
      try {
        const isolate = await getIsolateById(accessToken, code);
        setIsolate(isolate);
      } catch (error) {
        setError(error.response.status);
      } finally {
        setLoadingIsolate(false);
      }
    };
    fetchIsolate();
  }, [accessToken, code]);

  useEffect(() => {
    if (isolate) {
      const data = getNameTaxonomyData(isolate);
      setNameTaxonomyData(data);
    }
  }, [isolate]);

  const firstTaxonomyGroup = nameTaxonomyData.slice(0, 3);
  const secondTaxonomyGroup = nameTaxonomyData.slice(3);

  useEffect(() => {
    if (editing && isolate) {
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

      form.setFieldsValue({
        access_level: isolate.access_level,
        organism_type: isolate.Organism.organism_type,
        genus: isolate.genus,
        species: isolate.species,
        isolate_domain: isolate.isolate_domain,
        isolate_phylum: isolate.isolate_phylum,
        isolate_class: isolate.isolate_class,
        isolate_order: isolate.isolate_order,
        isolate_family: isolate.isolate_family,
        sample_type: isolate.Sample.sample_type,
        method: isolate.Method.method,
        institution_name: isolate.Institution.institution_name,
        collection_name: isolate.Collection.collection_name,
        host_type: isolate.Host.host_type,
        host_genus_species:
          isolate.Host.host_genus + " " + isolate.Host.host_species,
        cave_name: isolate.Cave.cave_name,
        location: isolate.Cave.Location.town,
        description: isolate.SamplingPoint.description,
      });
    }
  }, [
    uniqueCaves,
    uniqueDescriptions,
    uniqueHosts,
    uniqueHostGenusSpecies,
    uniqueMethods,
    uniqueInstitutions,
    uniqueCollections,
    uniqueOrganisms,
    uniqueSamples,
    editing,
    isolate,
    form,
  ]);

  useEffect(() => {
    if (deleteIsolateErrorMessage) {
      messageApi.open({
        type: "error",
        content: deleteIsolateErrorMessage,
      });
    }

    if (updateErrorMessage) {
      messageApi.open({
        type: "error",
        content: updateErrorMessage,
      });
    }
  }, [deleteIsolateErrorMessage, updateErrorMessage, messageApi]);

  const accessLevelOptions =
    authenticated && user && user.role_name === "Admin"
      ? ["Restricted", "Limited", "Public"]
      : ["Limited", "Public"];

  const openConfirmSave = () => {
    setConfirmSave(true);
  };

  const closeConfirmSave = () => {
    setConfirmSave(false);
  };

  const openDeleteModal = () => {
    setDeleteIsolateModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteIsolateModalOpen(false);
  };

  const handleEditIsolate = () => {
    setEditing(true);
  };

  const handleCancelEditing = () => {
    setEditing(false);
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
    } catch (error) {
      createError(error);
      throw error;
    }
  };

  const handleRemoveImage = async () => {
    setLoadingRemoveImage(true);
    try {
      const isolateId = isolate?.id;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.delete(`${backendUrl}/image/delete/${isolateId}`, config);
      setImageUrl(null);

      messageApi.open({
        type: "success",
        content: "Isolate image removed",
      });
    } catch (error) {
      createError(error);
      setLoadingRemoveImage(false);
    }
    setLoadingRemoveImage(false);
  };

  const onSaveIsolate = async (values) => {
    setLoadingSave(true);
    try {
      const [host_genus, host_species] = values.host_genus_species.split(" ");
      values.host_genus = host_genus;
      values.host_species = host_species;

      if (values.imageFile) {
        if (isolate?.image_ref) {
          await handleRemoveImage();
        }

        await uploadImage(isolate?.id, values.imageFile.file);
      }

      await updateIsolate(accessToken, isolate && isolate.id, values);
      const updatedIsolate = await getIsolateById(accessToken, code);
      setIsolate(updatedIsolate);
      setEditing(false);
      messageApi.open({
        type: "success",
        content: "Isolate has been successfully updated",
      });
    } catch (error) {
      setUpdateErrorMessage(error.response.data.message);
    }
    setLoadingSave(false);
    setConfirmSave(false);
  };

  const handleDeleteIsolate = async (isolateId) => {
    setLoadingDeleteIsolate(true);
    try {
      const isolateToDelete = [isolateId];
      await handleRemoveImage();
      await deleteIsolate(accessToken, isolateToDelete);
      navigate("/advsearch", { state: { deletionSuccess: true } });
    } catch (error) {
      setDeleteIsolateErrorMessage(error.response.data.message);
      setDeleteIsolateModalOpen(false);
    }
    setLoadingDeleteIsolate(false);
  };

  if (loadingIsolate) {
    return (
      <div className="isolate-spin-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    if (authenticated) {
      return <Error type={error} />;
    } else {
      navigate("/");
      return null;
    }
  }

  const containerStyle = {
    width: "350px",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    border: "1px solid #d9d9d9",
    backgroundColor: "#f0f0f0",
  };

  const imageStyle = {
    maxWidth: "auto",
    maxHeight: "100%",
    objectFit: "contain",
  };

  return (
    <div className="isolate-wrapper">
      {contextHolder}
      <Form form={form} autoComplete="off" onFinish={onSaveIsolate}>
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
            {editing && (
              <Form.Item className="isolate-form-submit">
                <Button
                  className="isolate-actions-save"
                  icon={<SaveOutlined />}
                  size="large"
                  onClick={openConfirmSave}
                >
                  Save
                </Button>
              </Form.Item>
            )}

            {!editing ? (
              <Tooltip placement="bottom" title="Edit">
                <Button
                  className="isolate-actions-edit"
                  size="large"
                  shape="circle"
                  onClick={() => handleEditIsolate(isolate && isolate.id)}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title="Cancel">
                <Button
                  className="isolate-actions-cancel"
                  size="large"
                  shape="circle"
                  onClick={handleCancelEditing}
                >
                  <CloseOutlined />
                </Button>
              </Tooltip>
            )}
            <Tooltip placement="bottom" title="Delete">
              <Button
                type="primary"
                size="large"
                danger
                shape="circle"
                onClick={openDeleteModal}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Space>
        </div>
        <Modal
          className="isolate-delete-modal"
          centered
          open={confirmSave}
          onCancel={closeConfirmSave}
          width={350}
          footer={[
            <Button
              className="isolate-delete-modal-btn isolate-cancel"
              key="back"
              onClick={closeConfirmSave}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              className="isolate-save-btn"
              loading={loadingSave}
              htmlType="submit"
              onClick={form.submit}
            >
              Save
            </Button>,
          ]}
        >
          <Space className="modal-wrapper" direction="vertical" align="center">
            <span className="modal-title">Save changes?</span>
            <div className="modal-desc">
              <Divider className="users-top-divider" />
              <span>
                Are you sure you want to save changes to isolate{" "}
                <span className="settings-du-modal-name">
                  {isolate && isolate.accession_no}
                </span>
                ?
              </span>
              <Divider className="users-top-divider" />
            </div>
          </Space>
        </Modal>
        <Modal
          className="isolate-delete-modal"
          centered
          open={deleteIsolateModalOpen}
          onCancel={closeDeleteModal}
          width={350}
          footer={[
            <Button
              className="isolate-delete-modal-btn"
              key="back"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>,
            <Button
              key="delete"
              type="primary"
              danger
              loading={loadingDeleteIsolate}
              onClick={() => handleDeleteIsolate(isolate && isolate.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <Space className="modal-wrapper" direction="vertical" align="center">
            <span className="modal-title">Delete isolate?</span>
            <div className="modal-desc">
              <Divider className="users-top-divider" />
              <span>
                Are you sure you want to delete isolate{" "}
                <span className="settings-du-modal-name">
                  {isolate && isolate.accession_no}
                </span>
                ? <br /> <br />
                This action cannot be undone.
              </span>
              <Divider className="users-top-divider" />
            </div>
          </Space>
        </Modal>

        <Card className="isolate-card">
          <div className="isolate-header">
            <span className="isolate-name">
              <i>
                {isolate && isolate.genus} {isolate && isolate.species}
              </i>
            </span>
            {editing ? (
              <div className="isolate-access-level-editing">
                <span className="isolate-row-key">Access Level</span>
                <Form.Item name={"access_level"}>
                  <Select placeholder="Select an access level">
                    {accessLevelOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            ) : (
              <Tag
                className="isolate_access_tag"
                color={
                  isolate &&
                  (isolate.access_level === "Public"
                    ? "green"
                    : isolate.access_level === "Restricted"
                    ? "red"
                    : isolate.access_level === "Limited"
                    ? "blue"
                    : "")
                }
                style={{ display: authenticated ? "inline-block" : "none" }}
              >
                {isolate && isolate.access_level}
              </Tag>
            )}

            <Divider className="isolate-header-divider" />
            <div className="isolate-code-section">
              <div className="isolate-code-info">
                <span>Accession No.: {isolate && isolate.accession_no}</span>
                <span>Code: {isolate && isolate.code}</span>
              </div>
            </div>
          </div>

          <div className="isolate-body-row-first">
            <div className="image-wrapper">
              <div style={containerStyle}>
                {imageUrl ? (
                  <Image src={imageUrl} style={imageStyle} />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>No image uploaded</span>}
                  />
                )}
              </div>
              {editing ? (
                <div className="edit-isolate-upload-container">
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
                  {isolate.image_ref && (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      loading={loadingRemoveImage}
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              ) : null}
            </div>

            <div className="isolate-sections">
              <div className="isolate-titles header name-taxonomy">
                <span>Name and Taxonomic Classification</span>
              </div>

              <div className="isolate-sections-rows">
                <div className="isolate-name-taxonomy-group">
                  <div className="isolate-sections-data name-taxonomy">
                    <span className="isolate-row-key name-taxonomy">
                      Organism Type
                    </span>
                    {editing ? (
                      <Form.Item
                        className="isolate-sections-editing"
                        name={"organism_type"}
                      >
                        <Select placeholder="Select an organism type">
                          {options.organismOptions}
                        </Select>
                      </Form.Item>
                    ) : (
                      <span>{isolate && isolate.Organism.organism_type}</span>
                    )}
                  </div>
                  {firstTaxonomyGroup.map((item, index) => (
                    <div
                      key={index}
                      className="isolate-sections-data name-taxonomy"
                    >
                      <span className="isolate-row-key name-taxonomy">
                        {item.label}
                      </span>
                      {editing ? (
                        <Form.Item
                          className="isolate-sections-editing"
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
                      ) : item.key === "genus" || item.key === "species" ? (
                        <span>
                          <i>{item.value}</i>
                        </span>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  {secondTaxonomyGroup.map((item, index) => (
                    <div
                      key={index}
                      className="isolate-sections-data name-taxonomy"
                    >
                      <span className="isolate-row-key name-taxonomy">
                        {item.label}
                      </span>
                      {editing ? (
                        <Form.Item
                          className="isolate-sections-editing"
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
                      ) : item.key === "genus" || item.key === "species" ? (
                        <span>
                          <i>{item.value}</i>
                        </span>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`isolate-sections isolation-environmental ${
              editing ? "editing" : ""
            }`}
          >
            <div className="isolate-titles header isolation-environental">
              <span>Isolation, Sampling, and Environmental Information</span>
            </div>
            <Space className="isolate-sections-rows" direction="vertical">
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Sample type/isolated from
                </div>
                {editing ? (
                  <Form.Item
                    name={"sample_type"}
                    className="isolate-list-value"
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
                ) : (
                  <span className="isolate-list-value">
                    <span className="isolate-list-value">
                      {isolate && isolate.Sample && isolate.Sample.sample_type}
                    </span>
                  </span>
                )}
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Analysis Method
                </div>
                {editing ? (
                  <Form.Item name={"method"} className="isolate-list-value">
                    <Select
                      className="isolate-list-value overflow"
                      placeholder="Select an analysis method"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.methodOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.Method?.method}
                  </span>
                )}
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
                {editing ? (
                  <Form.Item name={"host_type"} className="isolate-list-value">
                    <Select
                      className="isolate-list-value overflow"
                      placeholder="Select a host type"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.hostOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.Host?.host_type}
                  </span>
                )}
              </div>

              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Genus/Species
                </div>
                {editing ? (
                  <Form.Item
                    name={"host_genus_species"}
                    className="isolate-list-value editing"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Select
                      className="isolate-list-value overflow"
                      placeholder="Select a host genus"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.hostGenusSpeciesOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    <i>
                      {isolate?.Host?.host_genus} {isolate?.Host?.host_species}
                    </i>
                  </span>
                )}
              </div>
              {/* <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Genus
                </div>
                {editing ? (
                  <Form.Item
                    name={"host_genus"}
                    className="isolate-list-value editing"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Select
                      className="isolate-list-value overflow"
                      placeholder="Select a host genus"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.hostGenusOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    <i>{isolate?.Host?.host_genus}</i>
                  </span>
                )}
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Species
                </div>
                {editing ? (
                  <Form.Item
                    name={"host_species"}
                    className="isolate-list-value editing"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Select
                      className="isolate-list-value overflow"
                      placeholder="Select a host species"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.hostSpeciesOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    <i>{isolate?.Host?.host_species}</i>
                  </span>
                )}
              </div> */}
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
                {editing ? (
                  <Form.Item name={"cave_name"} className="isolate-list-value">
                    <Select
                      className="isolate-list-value overflow"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.caveOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.Cave?.cave_name}
                  </span>
                )}
              </div>
              {editing ? null : (
                <div className="isolate-sections-rows-item">
                  <div className="isolate-row-key isolation-environmental">
                    &emsp;&emsp;• Location
                  </div>

                  <span className="isolate-list-value">
                    {isolate?.Cave?.Location?.town},{" "}
                    {isolate?.Cave?.Location?.province}
                  </span>
                </div>
              )}
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  &emsp;&emsp;• Description
                </div>
                {editing ? (
                  <Form.Item
                    name={"description"}
                    className="isolate-list-value"
                  >
                    <Select
                      className="isolate-list-value overflow"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.descriptionOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.SamplingPoint?.description}
                  </span>
                )}
              </div>
              <hr className="isolate-row-divider" />
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Institution
                </div>
                {editing ? (
                  <Form.Item
                    name={"institution_name"}
                    className="isolate-list-value"
                  >
                    <Select
                      className="isolate-list-value overflow"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.institutionOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.Institution?.institution_name}
                  </span>
                )}
              </div>
              <div className="isolate-sections-rows-item">
                <div className="isolate-row-key isolation-environmental">
                  Collection
                </div>
                {editing ? (
                  <Form.Item
                    name={"collection_name"}
                    className="isolate-list-value"
                  >
                    <Select
                      className="isolate-list-value overflow"
                      dropdownStyle={{ minWidth: "60%" }}
                      placement="bottomRight"
                    >
                      {options.collectionOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <span className="isolate-list-value">
                    {isolate?.Collection?.collection_name}
                  </span>
                )}
              </div>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default Isolate;
