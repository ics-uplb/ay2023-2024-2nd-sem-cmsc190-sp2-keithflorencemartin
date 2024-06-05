import React, { useContext, useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { CollectionContext } from "../../context/CollectionContext";
import { InstitutionContext } from "../../context/InstitutionContext";
import { HostContext } from "../../context/HostContext";
import { LocationContext } from "../../context/LocationContext";
import { MethodContext } from "../../context/MethodContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { getMetadataValues } from "../../utils/metadataUtils";
import CreateEditMetadataModal from "../MetadataModal/CreateEditMetadataModal";
import DeleteMetadataModal from "../MetadataModal/DeleteMetadataModal";
import "./InfoTable.css";

const InfoTable = ({ title, model }) => {
  const { caves, locations, samplingPoints } = useContext(LocationContext);
  const { collections } = useContext(CollectionContext);
  const { institutions } = useContext(InstitutionContext);
  const { hosts } = useContext(HostContext);
  const { methods } = useContext(MethodContext);
  const { organisms } = useContext(OrganismContext);
  const { samples } = useContext(SampleContext);
  const [metadataValues, setMetadataValues] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    const values = getMetadataValues(title);
    setMetadataValues(values);

    switch (title) {
      case "Organism Type":
        setFilteredData(organisms);
        break;
      case "Sample Type":
        setFilteredData(samples);
        break;
      case "Host":
        setFilteredData(hosts);
        break;
      case "Analysis Method":
        setFilteredData(methods);
        break;
      case "Location":
        setFilteredData(locations);
        break;
      case "Cave":
        setFilteredData(caves);
        break;
      case "Sampling Point":
        setFilteredData(samplingPoints);
        break;
      case "Institution":
        setFilteredData(institutions);
        break;
      case "Collection":
        setFilteredData(collections);
        break;
      default:
        setFilteredData([]);
    }

    setLoadingTable(false);
  }, [
    title,
    organisms,
    samples,
    hosts,
    methods,
    locations,
    caves,
    samplingPoints,
    institutions,
    collections,
    setMetadataValues,
  ]);

  const handleEditClick = (record) => {
    setRecordToEdit(record);
    setOpenEdit(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setOpenDelete(false);
    setRecordToDelete(null);
  };

  const columns = [
    {
      title: `${metadataValues.title}`,
      dataIndex: `${title.toLowerCase()}`,
      key: `${title.toLowerCase()}`,
      sorter: (a, b) => {
        const rowA = a[metadataValues.fieldType];
        const rowB = b[metadataValues.fieldType];
        return rowA.localeCompare(rowB);
      },
      render: (_, record) => {
        return <span>{record[metadataValues.fieldType]}</span>;
      },
    },
  ];

  if (title === "Organism Type") {
    columns.push({
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value.localeCompare(b.value),
      render: (_, record) => {
        return <span>{record.value}</span>;
      },
    });
  }

  if (title === "Host") {
    columns.push(
      {
        title: "Host Genus",
        dataIndex: "host_genus",
        key: "host_genus",
        sorter: (a, b) => a.host_genus.localeCompare(b.host_genus),
        render: (_, record) => {
          return <span>{record.host_genus}</span>;
        },
      },
      {
        title: "Host Species",
        dataIndex: "host_species",
        key: "host_species",
        sorter: (a, b) => a.host_species.localeCompare(b.host_species),
        render: (_, record) => {
          return <span>{record.host_species}</span>;
        },
      }
    );
  }

  if (title === "Location") {
    columns.push(
      {
        title: "Town",
        dataIndex: "town",
        key: "town",
        sorter: (a, b) => a.town.localeCompare(b.town),
        render: (_, record) => {
          return <span>{record.town}</span>;
        },
      },
      {
        title: "Province",
        dataIndex: "province",
        key: "province",
        sorter: (a, b) => a.province.localeCompare(b.province),
        render: (_, record) => {
          return <span>{record.province}</span>;
        },
      }
    );
  }

  if (title === "Cave") {
    columns.push(
      {
        title: "Name",
        dataIndex: "cave_name",
        key: "cave_name",
        sorter: (a, b) => a.cave_name.localeCompare(b.cave_name),
        render: (_, record) => {
          return <span>{record.cave_name}</span>;
        },
      },
      {
        title: "Location Code",
        dataIndex: "location_code",
        key: "location_code",
        sorter: (a, b) => {
          const locationA = locations.find((loc) => loc.id === a.location_id);
          const locationB = locations.find((loc) => loc.id === b.location_id);
          const codeA = locationA ? locationA.location_code : "Unknown";
          const codeB = locationB ? locationB.location_code : "Unknown";
          return codeA.localeCompare(codeB);
        },
        render: (_, record) => {
          const location = locations.find(
            (loc) => loc.id === record.location_id
          );
          return <span>{location ? location.location_code : "Unknown"}</span>;
        },
      }
    );
  }

  if (title === "Institution") {
    columns.push({
      title: "Institution Name",
      dataIndex: "institution_name",
      key: "institution_name",
      sorter: (a, b) => a.institution_name.localeCompare(b.institution_name),
      render: (_, record) => {
        return <span>{record.institution_name}</span>;
      },
    });
  }

  if (title === "Collection") {
    columns.push({
      title: "Collection Name",
      dataIndex: "collection_name",
      key: "collection_name",
      sorter: (a, b) => a.collection_name.localeCompare(b.collection_name),
      render: (_, record) => {
        return <span>{record.collection_name}</span>;
      },
    });
  }

  columns.push({
    title: "Actions",
    key: "actions",
    align: "right",
    render: (_, record) => {
      return (
        <Space size="middle">
          <EditOutlined onClick={() => handleEditClick(record)} />
          <DeleteOutlined onClick={() => handleDeleteClick(record)} />
        </Space>
      );
    },
  });

  return (
    <div>
      <div className="info-table-add-btn-wrapper">
        <Button className="info-table-add-btn" onClick={() => setOpenAdd(true)}>
          <PlusOutlined />
        </Button>
      </div>
      <Table
        className="info-table"
        size="small"
        loading={loadingTable}
        pagination={{ position: ["bottomRight"] }}
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.id}
      />
      <DeleteMetadataModal
        title={title}
        model={model}
        openDelete={openDelete}
        handleCancelDelete={handleCancelDelete}
        recordToDelete={recordToDelete}
        setFilteredData={setFilteredData}
      />
      <CreateEditMetadataModal
        type={"create"}
        title={title}
        model={model}
        openEdit={openAdd}
        handleCancel={() => setOpenAdd(false)}
        setFilteredData={setFilteredData}
      />
      <CreateEditMetadataModal
        type={"edit"}
        title={title}
        model={model}
        openEdit={openEdit}
        handleCancel={() => setOpenEdit(false)}
        recordToEdit={recordToEdit}
        setFilteredData={setFilteredData}
      />
    </div>
  );
};

export default InfoTable;
