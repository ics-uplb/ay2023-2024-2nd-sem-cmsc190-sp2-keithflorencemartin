import "antd/dist/reset.css";
import "./App.css";
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { HostProvider } from "./context/HostContext";
import { OrganismProvider } from "./context/OrganismContext";
import { SampleProvider } from "./context/SampleContext";
import { MethodProvider } from "./context/MethodContext";
import { LocationProvider } from "./context/LocationContext";
import { IsolateProvider } from "./context/IsolateContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import { CollectionProvider } from "./context/CollectionContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import AdvancedSearch from "./pages/AdvancedSearch/AdvancedSearch";
import Isolate from "./pages/Isolate/Isolate";
import CreateIsolate from "./pages/Isolate/CreateIsolate";
import Error from "./pages/Error/Error";
import TaxonomicTree from "./pages/TaxonomicTree/TaxonomicTree";
import ManageMetadata from "./pages/ManageMetadata/ManageMetadata";

const PrivateRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);

  return authenticated ? children : <Navigate to="/" />;
};

const App = () => {
  document.body.style.backgroundColor = "#FAFAFA";

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#58703D",
            colorPrimaryHover: "#A2B68C",
          },
        },
      }}
    >
      <AuthProvider>
        <IsolateProvider>
          <HostProvider>
            <OrganismProvider>
              <SampleProvider>
                <MethodProvider>
                  <InstitutionProvider>
                    <CollectionProvider>
                      <LocationProvider>
                        <>
                          <Navbar />
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                              path="/settings"
                              element={
                                <PrivateRoute>
                                  <Settings />
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path="/manage-metadata"
                              element={
                                <PrivateRoute>
                                  <ManageMetadata />
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path="/advsearch"
                              element={<AdvancedSearch />}
                            />
                            <Route
                              path="/isolate/:code"
                              element={<Isolate />}
                            />
                            <Route
                              path="/isolate/create"
                              element={
                                <PrivateRoute>
                                  <CreateIsolate />
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path="/taxonomic-tree"
                              element={<TaxonomicTree />}
                            />
                            <Route path="*" element={<Error type={404} />} />
                          </Routes>
                        </>
                      </LocationProvider>
                    </CollectionProvider>
                  </InstitutionProvider>
                </MethodProvider>
              </SampleProvider>
            </OrganismProvider>
          </HostProvider>
        </IsolateProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
