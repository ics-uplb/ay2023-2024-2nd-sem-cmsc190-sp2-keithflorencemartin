import React, { useContext } from "react";
import { Affix, Anchor, Card, Divider, Layout } from "antd";
import { CollectionContext } from "../../context/CollectionContext";
import { InstitutionContext } from "../../context/InstitutionContext";
import { HostContext } from "../../context/HostContext";
import { LocationContext } from "../../context/LocationContext";
import { MethodContext } from "../../context/MethodContext";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import InfoTable from "../../components/InfoTable/InfoTable";
import "./ManageMetadata.css";

const { Sider, Content } = Layout;

const ManageMetadata = () => {
  const { collections } = useContext(CollectionContext);
  const { institutions } = useContext(InstitutionContext);
  const { hosts } = useContext(HostContext);
  const { locations, caves, samplingPoints } = useContext(LocationContext);
  const { methods } = useContext(MethodContext);
  const { organisms } = useContext(OrganismContext);
  const { samples } = useContext(SampleContext);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        className="manage-metadata-sider"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Affix offsetTop={100}>
          <div>
            <div className="manage-metadata-sider-title">
              <span>Manage Metadata</span>
            </div>
            <Anchor
              affix={false}
              className="manage-metadata-sider-content"
              items={[
                {
                  href: "#institutions",
                  title: "Institutions",
                  key: "institutions",
                },
                {
                  href: "#collections",
                  title: "Collections",
                  key: "collections",
                },
                {
                  href: "#organism-types",
                  title: "Organism Types",
                  key: "organism-types",
                },
                {
                  href: "#sample-types",
                  title: "Sample Types",
                  key: "sample-types",
                },
                {
                  href: "#hosts",
                  title: "Hosts",
                  key: "hosts",
                },
                {
                  href: "#analysis-methods",
                  title: "Analysis Methods",
                  key: "analysis-methods",
                },
                {
                  href: "#sampling-points",
                  title: "Sampling Points",
                  key: "sampling-points",
                },
                { href: "#locations", title: "Locations", key: "locations" },
                { href: "#caves", title: "Caves", key: "caves" },
              ]}
            ></Anchor>
          </div>
        </Affix>
      </Sider>
      <Layout>
        <Content
          id="content-container"
          style={{ padding: "0 24px", minHeight: 280 }}
          className="manage-metadata-layout-content"
        >
          <Card className="manage-metadata-page-header">
            <span>
              <b>Welcome Admin!</b> This page provides you with extensive
              control over CaveIS isolate metadata, enabling effortless
              configuration and updates.
            </span>
          </Card>

          <div id="institutions" className="section">
            <div className="section-table">
              <h1>| Institutions ({institutions.length})</h1>
              <InfoTable title="Institution" model="institution" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="collections" className="section">
            <div className="section-table">
              <h1>| Collections ({collections.length})</h1>
              <InfoTable title="Collection" model="collection" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="organism-types" className="section">
            <div className="section-table">
              <h1>| Organism Types ({organisms.length})</h1>
              <InfoTable title="Organism Type" model="organism" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="sample-types" className="section">
            <div className="section-table">
              <h1>| Sample Types ({samples.length})</h1>
              <InfoTable title="Sample Type" model="sample" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="hosts" className="section">
            <div className="section-table">
              <h1>| Hosts ({hosts.length})</h1>
              <InfoTable title="Host" model="host" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="analysis-methods" className="section">
            <div className="section-table">
              <h1>| Analysis Methods ({methods.length})</h1>
              <InfoTable title="Analysis Method" model="method" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="sampling-points" className="section">
            <div className="section-table">
              <h1>| Sampling Points ({samplingPoints.length})</h1>
              <InfoTable title="Sampling Point" model="samplingPoint" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="locations" className="section">
            <div className="section-table">
              <h1>| Locations ({locations.length})</h1>
              <InfoTable title="Location" model="location" />
            </div>
          </div>

          <Divider className="manage-metadata-divider" />
          <div id="caves" className="section">
            <div className="section-table">
              <h1>| Caves ({caves.length})</h1>
              <InfoTable title="Cave" model="cave" />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageMetadata;
