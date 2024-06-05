import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tree from "react-d3-tree";
import { Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getAllIsolates, getIsolateByKeyword } from "../../utils/api/getApi";
import { getCookie } from "../../utils/cookieUtils";
import "./TaxonomicTree.css";

const TaxonomicTree = () => {
  const navigate = useNavigate();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isolates, setIsolates] = useState([]);
  const [expandTree, setExpandTree] = useState(false);
  const accessToken = getCookie("sessionToken");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchIsolates = async () => {
      const data = await getAllIsolates(accessToken);
      setIsolates(data.isolates);
    };

    fetchIsolates();
  }, [accessToken]);

  useEffect(() => {
    const dimensions = containerRef.current.getBoundingClientRect();
    setTranslate({ x: dimensions.width * 0.1, y: dimensions.height * 0.5 });
  }, []);

  const createTreeData = (data) => {
    const tree = {};

    data.forEach((isolate) => {
      const {
        Organism,
        genus,
        species,
        accession_no,
        isolate_domain,
        isolate_phylum,
        isolate_class,
        isolate_order,
        isolate_family,
      } = isolate;
      const organismType = Organism.organism_type;

      if (!tree[organismType]) {
        tree[organismType] = {};
      }

      if (!tree[organismType][isolate_domain]) {
        tree[organismType][isolate_domain] = {};
      }

      if (!tree[organismType][isolate_domain][isolate_phylum]) {
        tree[organismType][isolate_domain][isolate_phylum] = {};
      }

      if (!tree[organismType][isolate_domain][isolate_phylum][isolate_class]) {
        tree[organismType][isolate_domain][isolate_phylum][isolate_class] = {};
      }

      if (
        !tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ]
      ) {
        tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ] = {};
      }

      if (
        !tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family]
      ) {
        tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family] = {};
      }

      if (
        !tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family][genus]
      ) {
        tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family][genus] = {
          species: {},
        };
      }

      if (
        !tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family][genus].species[species]
      ) {
        tree[organismType][isolate_domain][isolate_phylum][isolate_class][
          isolate_order
        ][isolate_family][genus].species[species] = [];
      }

      // Pushing the accession_no to the species level
      tree[organismType][isolate_domain][isolate_phylum][isolate_class][
        isolate_order
      ][isolate_family][genus].species[species].push(accession_no);
    });

    const treeData = convertTreeToArray(tree);

    return treeData;
  };

  // Function to convert the tree object into an array
  const convertTreeToArray = (tree) => {
    const array = [];

    for (const [organismType, organismTypeData] of Object.entries(tree)) {
      const organismTypeNode = {
        name: organismType,
        children: [],
      };

      for (const [isolateDomain, isolateDomainData] of Object.entries(
        organismTypeData
      )) {
        const isolateDomainNode = {
          name: isolateDomain,
          children: [],
        };

        for (const [isolatePhylum, isolatePhylumData] of Object.entries(
          isolateDomainData
        )) {
          const isolatePhylumNode = {
            name: isolatePhylum,
            children: [],
          };

          for (const [isolateClass, isolateClassData] of Object.entries(
            isolatePhylumData
          )) {
            const isolateClassNode = {
              name: isolateClass,
              children: [],
            };

            for (const [isolateOrder, isolateOrderData] of Object.entries(
              isolateClassData
            )) {
              const isolateOrderNode = {
                name: isolateOrder,
                children: [],
              };

              for (const [isolateFamily, isolateFamilyData] of Object.entries(
                isolateOrderData
              )) {
                const isolateFamilyNode = {
                  name: isolateFamily,
                  children: [],
                };

                for (const [genus, genusData] of Object.entries(
                  isolateFamilyData
                )) {
                  const genusNode = {
                    name: genus,
                    children: [],
                  };

                  for (const [species, speciesData] of Object.entries(
                    genusData.species
                  )) {
                    const speciesNode = {
                      name: species,
                      children: speciesData.map((accession_no) => ({
                        name: accession_no,
                      })),
                    };
                    genusNode.children.push(speciesNode);
                  }

                  isolateFamilyNode.children.push(genusNode);
                }

                isolateOrderNode.children.push(isolateFamilyNode);
              }

              isolateClassNode.children.push(isolateOrderNode);
            }

            isolatePhylumNode.children.push(isolateClassNode);
          }

          isolateDomainNode.children.push(isolatePhylumNode);
        }

        organismTypeNode.children.push(isolateDomainNode);
      }

      array.push(organismTypeNode);
    }

    return { name: "Microorganisms", children: array };
  };

  const treeData = isolates.length > 0 ? createTreeData(isolates) : null;

  const handleLeafNodeClick = async (accessionNo) => {
    let keywords = {};
    keywords.accession_no = accessionNo;
    try {
      const response = await getIsolateByKeyword(
        accessToken,
        keywords,
        "accession_no"
      );

      navigate(`/isolate/${response[0].id}`);
    } catch (error) {
      console.error("Error fetching isolate data:", error);
    }
  };

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    if (nodeDatum.children) {
      return (
        <g>
          <circle r={15} onClick={toggleNode} />
          <text fill="black" strokeWidth="0.5" y={35} textAnchor="middle">
            {nodeDatum.name}
          </text>
        </g>
      );
    } else {
      return (
        <g>
          <circle
            r={15}
            onClick={() => {
              handleLeafNodeClick(nodeDatum.name);
            }}
          />
          <text
            fill="black"
            strokeWidth="0.5"
            y={35}
            textAnchor="middle"
            onClick={() => {
              handleLeafNodeClick(nodeDatum.name);
            }}
          >
            {nodeDatum.name}
          </text>
        </g>
      );
    }
  };

  return (
    <div className="taxonomic-tree-container" ref={containerRef}>
      <div className="taxonomic-tree-title-container">
        <div className="taxonomic-tree-header">
          <span className="taxonomic-tree-title caveis">CaveIS</span>
          <span className="taxonomic-tree-title">Taxonomic</span>
          <span className="taxonomic-tree-title">Tree</span>
          <span className="taxonomic-tree-description">
            Explore taxonomic relationships visually with this interactive
            Taxonomic Tree Viewer.
          </span>
          <div className="taxonomic-tree-buttons">
            <Button size="small" onClick={() => setExpandTree(true)}>
              Expand All
            </Button>
            <Button size="small" onClick={() => setExpandTree(false)}>
              Collapse All
            </Button>
          </div>
        </div>
        <div className="taxonomic-tree-guide">
          <span className="taxonomic-tree-guide-title">
            <QuestionCircleOutlined /> Guide
          </span>
          <span>
            <b>Zoom:</b> Scroll to zoom in/out.
          </span>
          <span>
            <b>Pan:</b> Click and drag to move around.
          </span>
          <span>
            <b>Click Nodes:</b> Expand/Collapse.
          </span>
        </div>
      </div>

      <div className="taxonomic-tree-item">
        {treeData && (
          <Tree
            data={treeData}
            initialDepth={!expandTree ? 0 : undefined}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
            translate={translate}
            renderCustomNodeElement={renderCustomNodeElement}
          />
        )}
      </div>
    </div>
  );
};

export default TaxonomicTree;
