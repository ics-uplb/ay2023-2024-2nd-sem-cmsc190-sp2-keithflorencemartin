import React, { useContext, useState, useEffect } from "react";
import { Button, Divider, message, Modal, Space } from "antd";
import { LocationContext } from "../../context/LocationContext";
import { deleteMetadata } from "../../utils/api/deleteApi";
import { getCookie } from "../../utils/cookieUtils";

const DeleteMetadataModal = ({
  title,
  model,
  openDelete,
  handleCancelDelete,
  recordToDelete,
  setFilteredData,
}) => {
  const { locations } = useContext(LocationContext);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [caveLocationCode, setCaveLocationCode] = useState(null);
  const accessToken = getCookie("sessionToken");

  useEffect(() => {
    if (recordToDelete) {
      if (title === "Cave") {
        const location = locations.find(
          (loc) => loc.id === recordToDelete.location_id
        );
        setCaveLocationCode(location.location_code);
      }
    }
  }, [recordToDelete, locations, title]);

  const success = (title) => {
    messageApi.open({
      type: "success",
      content: `${title} successfully deleted`,
    });
  };

  const deleteError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  const handleDeleteMetadata = async () => {
    setLoadingDelete(true);
    try {
      await deleteMetadata(model, accessToken, recordToDelete.id);

      setFilteredData((prevData) =>
        prevData.filter((item) => item.id !== recordToDelete.id)
      );

      handleCancelDelete();
      success(title);
    } catch (error) {
      deleteError(error.response.data.message);
      setLoadingDelete(false);
    }

    setLoadingDelete(false);
  };

  return (
    <Modal
      centered
      open={openDelete}
      onCancel={handleCancelDelete}
      width={500}
      footer={[
        <Button type="default" key="back" onClick={handleCancelDelete}>
          Cancel
        </Button>,
        <Button
          type="primary"
          key="delete"
          danger
          loading={loadingDelete}
          onClick={handleDeleteMetadata}
        >
          Delete
        </Button>,
      ]}
    >
      {contextHolder}
      <Space className="modal-wrapper" direction="vertical" align="center">
        <span className="modal-title">Delete {title}?</span>
        <div className="modal-desc">
          <Divider className="users-top-divider" />
          <span>
            {recordToDelete && (
              <>
                {title === "Institution" && (
                  <div className="info-table-delete-details">
                    <strong>
                      Institution Code: {recordToDelete.institution_code}
                    </strong>
                    <strong>
                      Institution Name: {recordToDelete.institution_name}
                    </strong>
                  </div>
                )}

                {title === "Collection" && (
                  <div className="info-table-delete-details">
                    <strong>
                      Collection Code: {recordToDelete.collection_code}
                    </strong>
                    <strong>
                      Collection Name: {recordToDelete.collection_name}
                    </strong>
                  </div>
                )}

                {title === "Organism Type" && (
                  <div className="info-table-delete-details">
                    <strong>
                      Organism Type: {recordToDelete.organism_type}
                    </strong>
                    <strong>Value: {recordToDelete.value}</strong>
                  </div>
                )}

                {title === "Sample Type" && (
                  <div className="info-table-delete-details">
                    <strong>Sample Type: {recordToDelete.sample_type}</strong>
                  </div>
                )}

                {title === "Host" && (
                  <div className="info-table-delete-details">
                    <strong>Host Type: {recordToDelete.host_type}</strong>
                    <strong>Host Genus: {recordToDelete.host_genus}</strong>
                    <strong>Host Species: {recordToDelete.host_species}</strong>
                  </div>
                )}

                {title === "Analysis Method" && (
                  <div className="info-table-delete-details">
                    <strong>Analysis Method: {recordToDelete.method}</strong>
                  </div>
                )}

                {title === "Sampling Point" && (
                  <div className="info-table-delete-details">
                    <strong>
                      Sampling Point: {recordToDelete.description}
                    </strong>
                  </div>
                )}

                {title === "Location" && (
                  <div className="info-table-delete-details">
                    <strong>
                      Location Code: {recordToDelete.location_code}
                    </strong>
                    <strong>Town: {recordToDelete.town}</strong>
                    <strong>Province: {recordToDelete.province}</strong>
                  </div>
                )}

                {title === "Cave" && (
                  <div className="info-table-delete-details">
                    <strong>Cave Code: {recordToDelete.cave_code}</strong>
                    <strong>Cave Name: {recordToDelete.cave_name}</strong>
                    <strong>
                      Location Code: {caveLocationCode && caveLocationCode}
                    </strong>
                  </div>
                )}
              </>
            )}
            <br />
            Please ensure that this data is not currently in use by any isolate
            before proceeding with the deletion. This action cannot be undone.
          </span>
          <Divider className="users-top-divider" />
        </div>
      </Space>
    </Modal>
  );
};

export default DeleteMetadataModal;
