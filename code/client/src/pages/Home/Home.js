import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ConfigProvider,
  Divider,
  Empty,
  Input,
  message,
  Select,
  Space,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import { Bar, Column, Pie } from "@ant-design/plots";
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { OrganismContext } from "../../context/OrganismContext";
import { SampleContext } from "../../context/SampleContext";
import { LocationContext } from "../../context/LocationContext";
import { IsolateContext } from "../../context/IsolateContext";
import { useUser } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { getIsolateByKeyword } from "../../utils/api/getApi";
import { getCookie } from "../../utils/cookieUtils";
import {
  sharedTypeConfig,
  sharedConfig,
  countIsolates,
} from "../../utils/graphUtils";
import "./Home.css";

const { Search } = Input;

const Home = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const { user } = useUser();
  const { caves, locations } = useContext(LocationContext);
  const { organisms } = useContext(OrganismContext);
  const { samples } = useContext(SampleContext);
  const {
    isolates,
    isolateTotal,
    limitedIsolatesTotal,
    restrictedIsolatesTotal,
    uniqueCaveIdCount,
  } = useContext(IsolateContext);
  const [graphData, setGraphData] = useState({
    province: [],
    cave: [],
    organism: [],
    sample: [],
  });
  const [searchOption, setSearchOption] = useState("accession_no");
  const [contentFontSize, setContentFontSize] = useState("4vw");
  const [titleFontSize, setTitleFontSize] = useState("1.5vw");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const accessToken = getCookie("sessionToken");
  var enye = "\u00f1";

  useEffect(() => {
    countIsolates(isolates, caves, locations, organisms, samples, setGraphData);
  }, [caves, isolates, locations, organisms, samples]);

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  const searchError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  const handleSearch = async () => {
    let keywords = {};
    if (searchOption === "accession_no") {
      keywords.accession_no = searchInputValue.trim();
    } else {
      const words = searchInputValue.trim().split(" ");

      const genus = words.length > 0 ? words[0] : "";
      const species = words.length > 1 ? words[1] : "";

      keywords.genus = genus;
      keywords.species = species;
    }

    try {
      const response = await getIsolateByKeyword(
        accessToken,
        keywords,
        searchOption
      );

      if (searchOption === "accession_no") {
        navigate(`/isolate/${response[0].id}`);
      } else {
        navigate("/advsearch", {
          state: { searchedIsolates: response, searchValue: searchInputValue },
        });
      }
    } catch (error) {
      searchError(error.response.data.message);
    }
  };

  const updateFontSizes = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 847) {
      setContentFontSize("6vw");
      setTitleFontSize("2.5vw");
    } else {
      setContentFontSize("5vw");
      setTitleFontSize("1.5vw");
    }
  };

  const options = [
    {
      value: "accession_no",
      label: (
        <span className="home-search-options">
          <Tooltip
            className="home-search-options-tooltip"
            title={
              <div>
                Enter the accession number in the following format: [Collection
                Code]-[Institution Code]-[Isolate Code]
                <br />
                <br />
                For example: MCC-MNH-50001
              </div>
            }
            placement="left"
          >
            <QuestionCircleOutlined className="info-circle-icon" />
          </Tooltip>
          Accession No.
        </span>
      ),
    },
    {
      value: "genus_species",
      label: (
        <span className="home-search-options">
          <Tooltip
            className="home-search-options-tooltip"
            title={
              <div>
                Search for a genus, for example, "Escherichia".
                <br />
                <br />
                To search for a species, include the genus, for example,
                "Escherichia coli".
              </div>
            }
            placement="left"
          >
            <QuestionCircleOutlined className="info-circle-icon" />
          </Tooltip>
          Genus/Species
        </span>
      ),
    },
  ];

  useEffect(() => {
    updateFontSizes();

    window.addEventListener("resize", updateFontSizes);

    return () => {
      window.removeEventListener("resize", updateFontSizes);
    };
  }, []);

  return (
    <div className="container">
      {contextHolder}
      <div className="content">
        <div className="top-row">
          <div className="top-row-title">
            <h1 className="title cave">Cave</h1>
            <h1 className="title is">IS</h1>
          </div>
          <div className="title-desc-container">
            <h1 className="title-desc one">
              A Culture Collection Information System
            </h1>
            <h1 className="title-desc two">for Cave Microorganisms</h1>
          </div>
          <div className="search-bar">
            <Space.Compact>
              <Select
                className="select-dropdown"
                defaultValue="Accession No."
                options={options.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) => setSearchOption(value)}
              />
              <Search
                id="search-input"
                className="search-input"
                placeholder={`Search for ${
                  searchOption === `accession_no`
                    ? "an isolate accession number..."
                    : "an isolate genus/species..."
                }`}
                value={searchInputValue}
                onChange={handleInputChange}
                onSearch={handleSearch}
                allowClear
              />
            </Space.Compact>
          </div>
        </div>
        <div className="bottom-row">
          <div className="bottom-row-elements">
            <Typography className="bottom-row-left">
              CaveIS presents curated culture collection strains and information
              exclusively from CALABARZON caves, selected and studied by
              researchers at the Microbial Culture Collection, Museum of Natural
              History, University of the Philippines Los Ba{enye}os.
            </Typography>
            <Divider className="bottom-row-divider" type="vertical" />
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: contentFontSize,
                    titleFontSize: titleFontSize,
                  },
                },
              }}
            >
              <Statistic
                className="bottom-row-mid"
                title={
                  <span>
                    Total Isolates
                    {authenticated && user && (
                      <Tooltip
                        title={
                          <span>
                            {authenticated &&
                              user &&
                              user.role_name === "Admin" && (
                                <>
                                  Restricted Access (Admins):{" "}
                                  {restrictedIsolatesTotal}
                                  <br />
                                </>
                              )}
                            Limited Access (Researchers): {limitedIsolatesTotal}
                            <br />
                            Public Access:{" "}
                            {
                              isolates.filter(
                                (isolate) => isolate.access_level === "Public"
                              ).length
                            }
                          </span>
                        }
                        placement="top"
                      >
                        <InfoCircleOutlined className="info-circle-icon statistic" />
                      </Tooltip>
                    )}
                  </span>
                }
                value={isolateTotal}
              />
              <Statistic
                className="bottom-row-right"
                title="Total Caves"
                value={uniqueCaveIdCount}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
      <Divider className="home-graphs-divider" />
      <div className="home-graphs">
        <div className="home-statistics-header">
          <div className="home-statistics-title">
            <span className="home-statistics-title cave">Cave</span>
            <span className="home-statistics-title is">IS</span>
            <span>&nbsp;Statistics</span>
          </div>
          <span className="home-statistics-desc">
            Discover key insights into cave microorganisms through concise data
            visualizations. Explore isolate distribution across various
            locations, caves, organism types, and sample types.
          </span>
        </div>

        <div className="home-all-graphs">
          <div className="home-graphs-top">
            <Card
              title="Isolate Distribution by Location"
              className="home-graphs-card"
            >
              {graphData.province.length === 0 ? (
                <Empty />
              ) : (
                <Column
                  data={graphData.province}
                  height={400}
                  {...sharedConfig}
                  colorField={"type"}
                  label={{ textBaseline: "bottom" }}
                  legend={true}
                />
              )}
            </Card>
            <div className="home-graphs-organism-sample">
              <Card
                title="Isolate Distribution by Organism Type"
                className="home-graphs-card organism"
              >
                {graphData.organism.length === 0 ? (
                  <Empty />
                ) : (
                  <Pie
                    data={graphData.organism.length > 0 && graphData.organism}
                    {...sharedTypeConfig}
                  />
                )}
              </Card>
              <Card
                title="Isolate Distribution by Sample Type"
                className="home-graphs-card"
              >
                {graphData.sample.length === 0 ? (
                  <Empty />
                ) : (
                  <Pie
                    data={graphData.sample.length > 0 && graphData.sample}
                    {...sharedTypeConfig}
                  />
                )}
              </Card>
            </div>
          </div>
          <Card
            title="Isolate Distribution by Cave"
            className="home-graphs-container-cave"
          >
            {graphData.cave.length === 0 ? (
              <Empty />
            ) : (
              <Bar
                data={graphData.cave}
                height={600}
                {...sharedConfig}
                colorField={"province"}
                label={{ position: "right" }}
                legend={true}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
