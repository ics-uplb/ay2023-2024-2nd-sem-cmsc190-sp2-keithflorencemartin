import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import {
  Button,
  Card,
  Collapse,
  Checkbox,
  Divider,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { LocationContext } from "../../context/LocationContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { getAllIsolates, getIsolateById } from "../../utils/api/getApi";
import { deleteIsolate } from "../../utils/api/deleteApi";
import { getCookie } from "../../utils/cookieUtils";
import { applyFilters } from "../../utils/isolateUtils";
import Error from "../Error/Error";
import "./AdvancedSearch.css";

const { Panel } = Collapse;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AdvancedSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { authenticated } = useContext(AuthContext);
  const { caves, samplingPoints, locationMap, uniqueLocations } =
    useContext(LocationContext);
  const { organisms, organismTypeMap, uniqueOrganisms } =
    useContext(OrganismContext);
  const { samples, sampleTypeMap, uniqueSamples } = useContext(SampleContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteIsolateModalOpen, setDeleteIsolateModalOpen] = useState(false);
  const [loadingDeleteIsolate, setLoadingDeleteIsolate] = useState(false);
  const [deleteIsolateErrorMessage, setDeleteIsolateErrorMessage] =
    useState("");
  const [isolates, setIsolates] = useState([]);
  const [loadingIsolates, setLoadingIsolates] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredIsolates, setFilteredIsolates] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    access_levels: ["Public", "Limited", "Restricted"],
    locations: [],
    organisms: [],
    samples: [],
  });
  const accessToken = getCookie("sessionToken");
  const [searchValue, setSearchValue] = useState(
    location.state?.searchValue || ""
  );
  const [collapse, setCollapse] = useState(false);
  const [openPanels, setOpenPanels] = useState([]);

  useEffect(() => {
    if (deleteIsolateErrorMessage) {
      messageApi.open({
        type: "error",
        content: "Error in deleting isolate/s",
      });
    }
  }, [deleteIsolateErrorMessage, messageApi]);

  useEffect(() => {
    const records = filteredIsolates
      .filter((isolate) => selectedRowKeys.includes(isolate.id))
      .map(
        ({
          id,
          accession_no,
          code,
          genus,
          species,
          access_level,
          Organism,
          Sample,
          Host,
          Method,
          SamplingPoint,
          Cave,
          Institution,
          Collection,
        }) => ({
          id,
          accession_no,
          code,
          genus,
          species,
          access_level,
          organism_type: Organism?.organism_type,
          sample_type: Sample?.sample_type,
          host_type: Host?.host_type,
          host_genus: Host?.host_genus,
          host_species: Host?.host_species,
          method: Method?.method,
          sampling_point_description: SamplingPoint?.description,
          cave_code: Cave?.cave_code,
          cave_name: Cave?.cave_name,
          location_code: Cave?.Location?.location_code,
          town: Cave?.Location?.town,
          province: Cave?.Location?.province,
          institution_code: Institution?.institution_code,
          institution_name: Institution?.institution_name,
          collection_code: Collection?.collection_code,
          collection_name: Collection?.collection_name,
        })
      );
    setSelectedRecords(records);
  }, [selectedRowKeys, filteredIsolates]);

  useEffect(() => {
    const updatePredicate = () => {
      setCollapse(window.innerWidth < 987);
      if (collapse) {
        setOpenPanels([]);
      } else {
        setOpenPanels(authenticated ? ["1", "2", "3", "4"] : ["2", "3", "4"]);
      }
    };

    updatePredicate();
    window.addEventListener("resize", updatePredicate);
    return () => {
      window.removeEventListener("resize", updatePredicate);
    };
  }, [authenticated, collapse]);

  useEffect(() => {
    setSearchValue(location.state?.searchValue || "");
    setFilteredIsolates(location.state?.searchedIsolates || isolates);
  }, [location.state?.searchValue, location.state?.searchedIsolates, isolates]);

  const showError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  useEffect(() => {
    if (location.state && location.state.deletionSuccess) {
      messageApi.open({
        type: "success",
        content: "Isolate deleted successfully.",
      });

      window.history.replaceState(
        { ...location.state, deletionSuccess: undefined },
        ""
      );
    }
  }, [location, messageApi]);

  const openDeleteModal = () => {
    setDeleteIsolateModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteIsolateModalOpen(false);
  };

  const onSelectChange = (record, selected) => {
    if (selected) {
      setSelectedRowKeys((keys) => [...keys, record.id]);
    } else {
      setSelectedRowKeys((keys) => {
        const index = keys.indexOf(record.id);
        return [...keys.slice(0, index), ...keys.slice(index + 1)];
      });
    }
  };

  const toggleSelectAll = () => {
    setSelectedRowKeys((keys) =>
      keys.length === filteredIsolates.length
        ? []
        : filteredIsolates.map((r) => r.id)
    );

    const allSelected = selectedRowKeys.length === filteredIsolates.length;
    const tableElement = document.querySelector(".isolates-table");
    if (allSelected) {
      tableElement.classList.add("all-selected");
    } else {
      tableElement.classList.remove("all-selected");
    }
  };

  const headerCheckbox = (
    <Checkbox
      checked={selectedRowKeys.length}
      indeterminate={
        selectedRowKeys.length > 0 &&
        selectedRowKeys.length < filteredIsolates.length
      }
      onChange={toggleSelectAll}
    />
  );

  const handleFilterChange = (filterLabel) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterLabel]: !prevState[filterLabel],
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setFilteredIsolates(isolates);
  };

  useEffect(() => {
    setLoadingIsolates(true);
    const fetchIsolates = async () => {
      await getAllIsolates(accessToken, setIsolates);
      setLoadingIsolates(false);
    };

    fetchIsolates();
  }, [accessToken]);

  useEffect(() => {
    setFilterOptions((prevState) => ({
      ...prevState,
      locations: uniqueLocations,
      organisms: uniqueOrganisms,
      samples: uniqueSamples,
    }));
  }, [uniqueLocations, uniqueOrganisms, uniqueSamples]);

  const getLocationInfo = (caveId) => {
    const cave = caves.find((c) => c.id === caveId);
    if (cave) {
      const locationId = cave.location_id;
      return locationMap[locationId];
    }
    return null;
  };

  const handleSearch = (searchText) => {
    setSearchValue(searchText);
    if (!searchText.trim()) {
      setFilteredIsolates(isolates);
    } else {
      const [genus, species] = searchText.trim().split(" ");

      const filtered = isolates.filter(
        (isolate) =>
          (genus
            ? isolate.genus?.toLowerCase().includes(genus.toLowerCase())
            : true) &&
          (species
            ? isolate.species?.toLowerCase().includes(species.toLowerCase())
            : true)
      );

      setFilteredIsolates(filtered);
    }
  };

  const handleExportMenuClick = (e) => {
    if (e.key === "2") {
      openDeleteModal();
    }
  };

  const handleRemoveImage = async (isolateId) => {
    try {
      const isolate = await getIsolateById(accessToken, isolateId);

      if (!isolate.image_ref) {
        return;
      } else {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        await axios.delete(`${backendUrl}/image/delete/${isolateId}`, config);
      }
    } catch (error) {
      console.log("Error in deleting selected isolates image:", error);
      showError(error);
    }
  };

  const removeImages = async () => {
    for (const isolateId of selectedRowKeys) {
      try {
        await handleRemoveImage(isolateId);
      } catch (error) {
        console.error("Error removing image:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    setLoadingDeleteIsolate(true);

    try {
      await removeImages();
      await deleteIsolate(accessToken, selectedRowKeys);
      setSelectedRowKeys([]);
      setDeleteIsolateModalOpen(false);
      messageApi.open({
        type: "success",
        content: "Isolate/s deleted successfully.",
      });
      const updatedIsolates = filteredIsolates.filter(
        (isolate) => !selectedRowKeys.includes(isolate.id)
      );
      setFilteredIsolates(updatedIsolates);
    } catch (error) {
      setDeleteIsolateErrorMessage(error.response.data.message);
      setDeleteIsolateModalOpen(false);
    }
    setLoadingDeleteIsolate(false);
  };

  const accessLevelLabels = {
    public: "Public",
    limited: "Limited",
    ...(authenticated &&
      user &&
      user.role_name === "Admin" && { restricted: "Restricted" }), // Include "Restricted" only if user is Admin
  };

  const items = [
    {
      label: (
        <CSVLink
          data={selectedRecords}
          filename={"CaveIS_Isolates_Selected.csv"}
          className="export-csv-link"
        >
          Export Selected
        </CSVLink>
      ),
      key: "1",
      icon: <ExportOutlined />,
    },
    {
      label: "Delete Selected",
      key: "2",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items: authenticated ? items : [items[0]],
    onClick: handleExportMenuClick,
    disabled: !selectedRowKeys.length,
  };

  const handleIsolateClick = async (isolateId) => {
    try {
      await getIsolateById(accessToken, isolateId);
      navigate(`/isolate/${isolateId}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return <Error type={404} />;
      } else {
        console.error("Error retrieving isolate:", error);
      }
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code - b.code,
      render: (_, record, index) => {
        return <span>{record.code}</span>;
      },
      width: "12%",
    },
    {
      title: `Isolates (${filteredIsolates.length})`,
      dataIndex: "isolates",
      key: "isolate_info",
      sorter: (a, b) => {
        const genusSpeciesA = `${a.genus} ${a.species}`;
        const genusSpeciesB = `${b.genus} ${b.species}`;
        return genusSpeciesA.localeCompare(genusSpeciesB);
      },
      render: (_, record, index) => {
        const organism = organisms.find((org) => org.id === record.organism_id);
        const organismType = organism ? organism.organism_type : "Unknown";

        const sample = samples.find((sample) => sample.id === record.sample_id);
        const sampleType = sample ? sample.sample_type : "Unknown";

        const location = getLocationInfo(record.cave_id);
        const locationInfo = location
          ? `${location.town}, ${location.province}`
          : "Unknown Location";

        return (
          <div className="isolates-table-record">
            <div className="isolates-table-info">
              <span
                className="advsearch-table-row-name"
                onClick={() => {
                  handleIsolateClick(record.id);
                }}
              >
                <i>
                  {record.genus} {record.species}
                </i>
                <RightOutlined className="advsearch-table-row-arrow" />
              </span>
              <span>Accession No.: {record.accession_no}</span>
              <span>Location: {locationInfo}</span>
            </div>
            <div className="advsearch-table-right">
              {record.access_level && (
                <Tag
                  className="advsearch-access-tag"
                  color={
                    record.access_level === "Public"
                      ? "green"
                      : record.access_level === "Restricted"
                      ? "red"
                      : record.access_level === "Limited"
                      ? "blue"
                      : ""
                  }
                  style={{ display: authenticated ? "inline-block" : "none" }}
                >
                  {record.access_level}
                </Tag>
              )}
              <div className="isolates-table-types">
                <span>Organism: {organismType}</span>
                <span>Sample: {sampleType}</span>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="advsearch-page">
      {contextHolder}
      <div className="advsearch-body">
        <div className="advsearch-filter-container">
          <Card className="advsearch-filter-card">
            <div className="advsearch-filter-content">
              <div className="advsearch-filter-title-container">
                <span className="advsearch-filter-title">Filters</span>
                <span
                  className="advsearch-filter-clear"
                  onClick={clearAllFilters}
                >
                  Clear all
                </span>
              </div>
              <Collapse
                className="advsearch-filter-collapse"
                activeKey={openPanels}
                onChange={setOpenPanels}
              >
                {authenticated && (
                  <Panel
                    className="advsearch-filter-panel"
                    header="Access Level"
                    key="1"
                  >
                    {Object.entries(accessLevelLabels).map(([key, value]) => (
                      <div key={key}>
                        <Checkbox
                          className="advsearch-filter-options"
                          key={key}
                          checked={selectedFilters[value] || false}
                          onChange={() => handleFilterChange(value)}
                        >
                          {value}
                        </Checkbox>
                      </div>
                    ))}
                  </Panel>
                )}

                <Panel
                  className="advsearch-filter-panel"
                  header="Location"
                  key="2"
                >
                  {filterOptions.locations.map(({ label }) => (
                    <div key={label}>
                      <Checkbox
                        className="advsearch-filter-options"
                        key={label}
                        checked={selectedFilters[label] || false}
                        onChange={() => handleFilterChange(label)}
                      >
                        {label}
                      </Checkbox>
                    </div>
                  ))}
                </Panel>
                <Panel
                  className="advsearch-filter-panel"
                  header="Organism Type"
                  key="3"
                >
                  {filterOptions.organisms.map(({ label }) => (
                    <div key={label}>
                      <Checkbox
                        className="advsearch-filter-options"
                        key={label}
                        checked={selectedFilters[label] || false}
                        onChange={() => handleFilterChange(label)}
                      >
                        {label}
                      </Checkbox>
                    </div>
                  ))}
                </Panel>
                <Panel
                  className="advsearch-filter-panel"
                  header="Sample Type"
                  key="4"
                >
                  {filterOptions.samples.map(({ label }) => (
                    <div key={label}>
                      <Checkbox
                        className="advsearch-filter-options"
                        key={label}
                        checked={selectedFilters[label] || false}
                        onChange={() => handleFilterChange(label)}
                      >
                        {label}
                      </Checkbox>
                    </div>
                  ))}
                </Panel>
              </Collapse>
            </div>
            <Button
              className="advsearch-filter-apply"
              size="large"
              onClick={() => {
                applyFilters(
                  selectedFilters,
                  filterOptions,
                  isolates,
                  organismTypeMap,
                  sampleTypeMap,
                  samplingPoints,
                  caves,
                  locationMap,
                  setFilteredIsolates
                );
              }}
            >
              Apply
            </Button>
          </Card>
        </div>
        <div className="advsearch-right-container">
          {!authenticated ? (
            <div className="advsearch-right-container-card">
              <span>
                <InfoCircleOutlined /> &nbsp; You are currently viewing isolates
                tagged for public access. To view more, please log in.
              </span>
            </div>
          ) : null}
          <div className="advsearch-search-container">
            <Button
              className="advsearch-add-btn"
              icon={<PlusOutlined />}
              size="large"
              style={{ display: authenticated ? "inline-block" : "none" }}
              onClick={() => navigate("/isolate/create")}
            >
              Create
            </Button>
            <Input
              className="advsearch-search-bar"
              placeholder="Search isolates"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
              suffix={<SearchOutlined style={{ color: "#818080" }} />}
              value={searchValue}
            />
            <Dropdown menu={menuProps} placement="bottomRight">
              <Button size="large">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Modal
              centered
              open={deleteIsolateModalOpen}
              onCancel={closeDeleteModal}
              width={350}
              footer={[
                <Button
                  className="isolate-cancel-modal-btn"
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
                  onClick={handleDeleteSelected}
                >
                  Delete
                </Button>,
              ]}
            >
              <Space
                className="modal-wrapper"
                direction="vertical"
                align="center"
              >
                <span className="modal-title">Delete selected isolate/s?</span>
                <div className="modal-desc">
                  <Divider className="users-top-divider" />
                  <span>
                    Are you sure you want to delete the selected isolate/s?{" "}
                    <br /> <br />
                    This action cannot be undone.
                  </span>
                  <Divider className="users-top-divider" />
                </div>
              </Space>
            </Modal>
          </div>
          <Table
            title={
              hasSelected
                ? () => `${selectedRowKeys.length} row(s) selected`
                : null
            }
            pagination={{
              position: ["bottomCenter"],
            }}
            className="isolates-table"
            columns={columns}
            dataSource={filteredIsolates}
            loading={loadingIsolates}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              type: "checkbox",
              fixed: true,
              onSelect: onSelectChange,
              columnTitle: headerCheckbox,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
