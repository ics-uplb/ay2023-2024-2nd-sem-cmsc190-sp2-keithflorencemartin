const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

const options = {
  definition: {
    openapi: '3.1.0', // Specify the version of Swagger/OpenAPI
    info: {
      title: 'RESTful API for the Microbial Diversity of Bat and Bat Guano from CALABARZON Caves',
      version: '1.0.0',
      description: 'Your API description',
    },
    servers: [
        {
          url: 'http://localhost:8000',
          description: 'Development Server',
        },
        {
          url: 'https://bat-guano-microbialdiversity.onrender.com',
          description: 'Render Deployment Server',
        }
    ],
    tags: [
        {
            name: 'User',
            description: 'APIs for managing user information'
        },
        {
            name: 'Isolate',
            description: 'APIs for managing isolate information'
        },
        {
            name: 'Organism',
            description: 'APIs for managing organism information'
        },
        {
            name: 'Sample',
            description: 'APIs for managing sample information'
        },
        {
            name: 'Host',
            description: 'APIs for managing host information'
        },
        {
            name: 'Method',
            description: 'APIs for managing method information'
        },
        {
            name: 'Location',
            description: 'APIs for managing location information'
        },
        {
            name: 'Cave',
            description: 'APIs for managing cave information'
        },
        {
            name: 'Sampling Point',
            description: 'APIs for managing sampling point information'
        },    
    ],
    paths: {
      "/register": {
        "post": {
          "tags": ["User"],
          "summary": "User registration",
          "description": "Registers a new user.",
          "operationId": "authRoute.register",
          "requestBody": {
            "description": "User registration data",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "username": {"type": "string"},
                    "email": {"type": "string", "format": "email"},
                    "password": {"type": "string"},
                    "role_name": {
                      "type": "string",
                      "enum": ["Admin", "Researcher", "Guest"]
                    }
                  },
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Successful user registration",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Successful user registration."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "Missing required fields or invalid email format."
                  }
                }
              }
            },
            "409": {
              "description": "Conflict",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Conflict",
                    "message": "User with provided username or email already exists."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Role with the provided name not found."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          }
        }
      },
      "/login": {
        "post": {
          "tags": ["User"],
          "summary": "User login",
          "description": "Logs in an existing user.",
          "operationId": "authRoute.login",
          "requestBody": {
            "description": "User login data",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {"type": "string"},
                    "password": {"type": "string"}
                  },
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Successfully logged in",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Successfully logged in!",
                    "accessToken": "your-access-token"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "Incorrect password."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "User with provided username does not exist."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          }
        }
      },
      "/user": {
        "get": {
          "tags": ["User"],
          "summary": "Get all users",
          "description": "Returns all users in the database.",
          "operationId": "getAllUsers",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/User"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No users found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/user/{id}": {
        "get": {
          "tags": ["User"],
          "summary": "Get a user by ID",
          "description": "Returns a user based on the provided ID.",
          "operationId": "getUserById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the user to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "User not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/user/update/{id}": {
        "patch": {
          "tags": ["User"],
          "summary": "Update a user by ID",
          "description": "Updates a user based on the provided ID with the given data.",
          "operationId": "updateUser",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the user to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
          ],
          "requestBody": {
            "description": "User data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "username": {"type": "string"}
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "example": {
                    "message": "User successfully updated."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "User with the provided ID not found."
                  }
                }
              }
            },
            "409": {
              "description": "Conflict",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Conflict",
                    "message": "Username already exists. Please choose a different one."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/user/delete/{id}": {
        "delete": {
          "tags": ["User"],
          "summary": "Delete user by ID",
          "description": "Deletes a user based on the provided ID.",
          "operationId": "deleteUser",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the user to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "User successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "User with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/isolate": {
        "get": {
          "tags": ["Isolate"],
          "summary": "Get all isolates",
          "description": "Returns all isolates in the database.",
          "operationId": "getAllIsolates",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Isolate"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No isolates found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/isolate/{id}": {
        "get": {
          "tags": ["Isolate"],
          "summary": "Get an isolate by ID",
          "description": "Returns an isolate based on the provided ID.",
          "operationId": "getIsolateById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the isolate to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "items": {
                      "$ref": "#/components/schemas/Isolate"
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Forbidden",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Forbidden",
                    "message": "Guest users can only access public isolates."
                  }
                }
              }
            },
            "404": {
              "description": "Isolate not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Isolate not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/isolate/search": {
        "get": {
          "tags": ["Isolate"],
          "summary": "Searching an isolate by keyword",
          "description": "Returns isolates based on the provided genus and/or species.",
          "operationId": "getIsolateByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "genus",
              "in": "query",
              "description": "Genus keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "species",
              "in": "query",
              "description": "Species keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Isolate"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "At least one of 'genus' or 'species' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/isolate/create": {
          "post": {
            "tags": ["Isolate"],
            "summary": "Create new isolate",
            "description": "Creates a new isolate in the database",
            "operationId": "createIsolate",
            "consumes": ["application/json"],
            "produces": ["application/json"],
            "requestBody": {
              "description": "Isolate data for creation",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "genus": {"type": "string"},
                          "species": {"type": "string"},
                          "organism_type": {"type": "string"},
                          "sample_type": {"type": "string"},
                          "host_species": {"type": "string"},
                          "method": {"type": "string"},
                          "institution_id": {"type": "integer"},
                          "collection_id": {"type": "integer"},
                          "name": {"type": "string"},
                          "description": {"type": "string"},
                          "access_level": {"type": "string"}
                        }
                      }
                  }
              }  
            },
            "responses": {
              "201": {
                "description": "Isolate Created",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "message": {"type": "string", "example": "Isolate successfully created."},
                        "data": {"$ref": "#/components/schemas/Isolate"}
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "Missing required fields."
                    }
                  }
                }
              },
              "404": {
                  "description": "Not Found",
                  "content": {
                    "application/json": {
                      "example": {
                        "error": "Not Found",
                        "message": "One or more entities not found in the database."
                      }
                    }
                  }
              },
              "401": {
                  "description": "Unauthorized",
                  "content": {
                      "application/json": {
                          "example": {
                              "error": "Unauthorized",
                              "message": "User is not authorized to access this resource."
                          }
                      }
                  }
              },
              "500": {
                  "description": "Internal Server Error",
                  "content": {
                      "application/json": {
                          "example": {
                              "error": "Internal Server Error",
                              "message": "An internal server error occurred while processing the request."
                          }
                      }
                  }
              }
            },
            "security": [
              {
                "Authentication": []
              }
            ]
          }
      },
      "/isolate/update/{id}": {
          "patch": {
            "tags": ["Isolate"],
            "summary": "Update isolate by ID",
            "description": "Updates an isolate based on the provided ID.",
            "operationId": "updateIsolate",
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "description": "ID of the isolate to be updated",
                "required": true,
                "schema": {
                  "type": "integer"
                }
              }
            ],
            "requestBody": {
              "description": "Isolate data for update",
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "genus": {"type": "string"},
                      "species": {"type": "string"},
                      "organism_type": {"type": "string"},
                      "sample_type": {"type": "string"},
                      "host_species": {"type": "string"},
                      "method": {"type": "string"},
                      "name": {"type": "string"},
                      "description": {"type": "string"},
                      "access_level": {"type": "string"}
                    }
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Isolate Updated",
                "content": {
                  "application/json": {
                    "example": {
                      "message": "Isolate successfully updated."
                    }
                  }
                }
              },
              "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "No data provided for update."
                    }
                  }
                }
              },
              "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "Isolate with the provided ID not found or one or more entities not found in the database."
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
            },
            "security": [
              {
                "Authentication": []
              }
            ]
          }
      },
      "/isolate/delete/{id}": {
          "delete": {
            "tags": ["Isolate"],
            "summary": "Delete isolate by ID",
            "description": "Deletes an isolate based on the provided ID.",
            "operationId": "deleteIsolate",
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "description": "ID of the isolate to be deleted",
                "required": true,
                "schema": {
                  "type": "integer"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Isolate Deleted",
                "content": {
                  "application/json": {
                    "example": {
                      "message": "Isolate successfully deleted."
                    }
                  }
                }
              },
              "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "Isolate with the provided ID not found in the database."
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to delete this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
            },
            "security": [
              {
                "Authentication": []
              }
            ]
          }
      },
      "/organism": {
        "get": {
          "tags": ["Organism"],
          "summary": "Get all organisms",
          "description": "Returns all organisms in the database.",
          "operationId": "getAllOrganisms",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Organism"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No organisms found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/organism/{id}": {
        "get": {
          "tags": ["Organism"],
          "summary": "Get a organism by ID",
          "description": "Returns a organism based on the provided ID.",
          "operationId": "getOrganismById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the organism to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Organism"
                  }
                }
              }
            },
            "404": {
              "description": "Organism not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Organism not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/organism/search": {
        "get": {
          "tags": ["Organism"],
          "summary": "Searching an organism by keyword",
          "description": "Returns organisms based on the provided organism.",
          "operationId": "getOrganismByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "organism",
              "in": "query",
              "description": "Organism keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Organism"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'organism' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/organism/create": {
        "post": {
          "tags": ["Organism"],
          "summary": "Create new organism",
          "description": "Creates a new organism in the database",
          "operationId": "createOrganism",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Organism data for creation",
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "organism_type": {"type": "string"},
                        "value": {"type": "integer"},
                      }
                    }
                }
            }  
          },
          "responses": {
            "201": {
              "description": "Organism Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {"type": "string", "example": "Organism successfully created."},
                      "data": {"$ref": "#/components/schemas/Organism"}
                    }
                  }
                }
              }
            },
            "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "Missing required fields."
                    }
                  }
                }
            },
            "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "One or more entities not found in the database."
                    }
                  }
                }
            },
            "401": {
                "description": "Unauthorized",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Unauthorized",
                            "message": "User is not authorized to access this resource."
                        }
                    }
                }
            },
            "500": {
                "description": "Internal Server Error",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Internal Server Error",
                            "message": "An internal server error occurred while processing the request."
                        }
                    }
                }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/organism/update/{id}": {
        "patch": {
          "tags": ["Organism"],
          "summary": "Update a organism by ID",
          "description": "Updates a organism based on the provided ID with the given data.",
          "operationId": "updateOrganism",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the organism to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
          ],
          "requestBody": {
            "description": "Organism data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "organism_type": {"type": "string"},
                    "value": {"type": "integer"}
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Organism successfully updated."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "404": {
              "description": "Organism not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Organism with the provided ID not found."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/organism/delete/{id}": {
        "delete": {
          "tags": ["Organism"],
          "summary": "Delete organism by ID",
          "description": "Deletes an organism based on the provided ID.",
          "operationId": "deleteOrganism",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the organism to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Organism Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Organism successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Organism with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample": {
        "get": {
          "tags": ["Sample"],
          "summary": "Get all samples",
          "description": "Returns all samples in the database.",
          "operationId": "getAllSamples",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Sample"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No samples found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample/{id}": {
        "get": {
          "tags": ["Sample"],
          "summary": "Get a sample by ID",
          "description": "Returns a sample based on the provided ID.",
          "operationId": "getSampleById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sample to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Sample"
                  }
                }
              }
            },
            "404": {
              "description": "Sample not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sample not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample/search": {
        "get": {
          "tags": ["Sample"],
          "summary": "Searching a sample by keyword",
          "description": "Returns samples based on the provided sample.",
          "operationId": "getSampleByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "sample",
              "in": "query",
              "description": "Sample keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Sample"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'sample' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample/create": {
        "post": {
          "tags": ["Sample"],
          "summary": "Create new sample",
          "description": "Creates a new sample in the database",
          "operationId": "createSample",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Sample data for creation",
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "sample_type": {"type": "string"}
                      }
                    }
                }
            }  
          },
          "responses": {
            "201": {
              "description": "Sample Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {"type": "string", "example": "Sample successfully created."},
                      "data": {"$ref": "#/components/schemas/Sample"}
                    }
                  }
                }
              }
            },
            "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "Missing required fields."
                    }
                  }
                }
            },
            "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "One or more entities not found in the database."
                    }
                  }
                }
            },
            "401": {
                "description": "Unauthorized",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Unauthorized",
                            "message": "User is not authorized to access this resource."
                        }
                    }
                }
            },
            "500": {
                "description": "Internal Server Error",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Internal Server Error",
                            "message": "An internal server error occurred while processing the request."
                        }
                    }
                }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample/update/{id}": {
        "patch": {
          "tags": ["Sample"],
          "summary": "Update a sample by ID",
          "description": "Updates a sample based on the provided ID with the given data.",
          "operationId": "updateSample",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sample to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
          ],
          "requestBody": {
            "description": "Sample data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sample_type": {"type": "string"}
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Sample successfully updated."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "404": {
              "description": "Sample not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sample with the provided ID not found."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                  "application/json": {
                      "example": {
                          "error": "Unauthorized",
                          "message": "User is not authorized to access this resource."
                      }
                  }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/sample/delete/{id}": {
        "delete": {
          "tags": ["Sample"],
          "summary": "Delete sample by ID",
          "description": "Deletes a sample based on the provided ID.",
          "operationId": "deleteSample",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sample to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Sample Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Sample successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sample with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host": {
        "get": {
          "tags": ["Host"],
          "summary": "Get all hosts",
          "description": "Returns all hosts in the database.",
          "operationId": "getAllHosts",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Host"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No hosts found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host/{id}": {
        "get": {
          "tags": ["Host"],
          "summary": "Get a host by ID",
          "description": "Returns a host based on the provided ID.",
          "operationId": "getHostById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the host to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Host"
                  }
                }
              }
            },
            "404": {
              "description": "Host not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Host not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host/search": {
        "get": {
          "tags": ["Host"],
          "summary": "Searching a host by keyword",
          "description": "Returns hosts based on the provided hostgenus.",
          "operationId": "getHostByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "hostgenus",
              "in": "query",
              "description": "Host keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Host"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'hostgenus' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host/create": {
        "post": {
          "tags": ["Host"],
          "summary": "Create new host",
          "description": "Creates a new host in the database",
          "operationId": "createHost",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Host data for creation",
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "host_type": {"type": "string"},
                        "host_genus": {"type": "string"},
                        "host_species": {"type": "string"},
                      }
                    }
                }
            }  
          },
          "responses": {
            "201": {
              "description": "Host Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {"type": "string", "example": "Host successfully created."},
                      "data": {"$ref": "#/components/schemas/Host"}
                    }
                  }
                }
              }
            },
            "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "Missing required fields."
                    }
                  }
                }
            },
            "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "One or more entities not found in the database."
                    }
                  }
                }
            },
            "401": {
                "description": "Unauthorized",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Unauthorized",
                            "message": "User is not authorized to access this resource."
                        }
                    }
                }
            },
            "500": {
                "description": "Internal Server Error",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Internal Server Error",
                            "message": "An internal server error occurred while processing the request."
                        }
                    }
                }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host/update/{id}": {
        "patch": {
          "tags": ["Host"],
          "summary": "Update a host by ID",
          "description": "Updates a host based on the provided ID with the given data.",
          "operationId": "updateHost",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the host to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
          ],
          "requestBody": {
            "description": "Host data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "host_type": {"type": "string"},
                    "host_genus": {"type": "string"},
                    "host_species": {"type": "string"},
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Host successfully updated."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "404": {
              "description": "Host not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Host with the provided ID not found."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                  "application/json": {
                      "example": {
                          "error": "Unauthorized",
                          "message": "User is not authorized to access this resource."
                      }
                  }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/host/delete/{id}": {
        "delete": {
          "tags": ["Host"],
          "summary": "Delete host by ID",
          "description": "Deletes a host based on the provided ID.",
          "operationId": "deleteHost",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the host to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Host Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Host successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Host with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method": {
        "get": {
          "tags": ["Method"],
          "summary": "Get all methods",
          "description": "Returns all methods in the database.",
          "operationId": "getAllMethods",
          "produces": ["application/json"],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Method"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No methods found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method/{id}": {
        "get": {
          "tags": ["Method"],
          "summary": "Get a method by ID",
          "description": "Returns a method based on the provided ID.",
          "operationId": "getMethodById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the method to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Method"
                  }
                }
              }
            },
            "404": {
              "description": "Method not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Method not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method/search": {
        "get": {
          "tags": ["Method"],
          "summary": "Searching a method by keyword",
          "description": "Returns methods based on the provided method.",
          "operationId": "getMethodByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "method",
              "in": "query",
              "description": "Method keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Method"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'method' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method/create": {
        "post": {
          "tags": ["Method"],
          "summary": "Create new method",
          "description": "Creates a new method in the database",
          "operationId": "createMethod",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Method data for creation",
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "method": {"type": "string"}
                      }
                    }
                }
            }  
          },
          "responses": {
            "201": {
              "description": "Method Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {"type": "string", "example": "Method successfully created."},
                      "data": {"$ref": "#/components/schemas/Method"}
                    }
                  }
                }
              }
            },
            "400": {
                "description": "Bad Request",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Bad Request",
                      "message": "Missing required fields."
                    }
                  }
                }
            },
            "404": {
                "description": "Not Found",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Not Found",
                      "message": "One or more entities not found in the database."
                    }
                  }
                }
            },
            "401": {
                "description": "Unauthorized",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Unauthorized",
                            "message": "User is not authorized to access this resource."
                        }
                    }
                }
            },
            "500": {
                "description": "Internal Server Error",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Internal Server Error",
                            "message": "An internal server error occurred while processing the request."
                        }
                    }
                }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method/update/{id}": {
        "patch": {
          "tags": ["Method"],
          "summary": "Update a method by ID",
          "description": "Updates a method based on the provided ID with the given data.",
          "operationId": "updateMethod",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the method to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
          ],
          "requestBody": {
            "description": "Method data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "method": {"type": "string"}
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Method successfully updated."
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "404": {
              "description": "Method not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Method with the provided ID not found."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                  "application/json": {
                      "example": {
                          "error": "Unauthorized",
                          "message": "User is not authorized to access this resource."
                      }
                  }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/method/delete/{id}": {
        "delete": {
          "tags": ["Method"],
          "summary": "Delete method by ID",
          "description": "Deletes a method based on the provided ID.",
          "operationId": "deleteMethod",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the method to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Method Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Method successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Method with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location": {
        "get": {
          "tags": ["Location"],
          "summary": "Get all locations",
          "description": "Returns all locations in the database.",
          "operationId": "getAllLocations",
          "produces": ["application/json"],
          "parameters": [
              {
                "name": "page",
                "in": "query",
                "description": "Page number for pagination",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "limit",
                "in": "query",
                "description": "Number of items to return per page",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              }
          ],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Location"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No locations found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location/{id}": {
        "get": {
          "tags": ["Location"],
          "summary": "Get a location by ID",
          "description": "Returns a location based on the provided ID.",
          "operationId": "getLocationById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the location to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Location"
                  }
                }
              }
            },
            "404": {
              "description": "Location not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Location not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location/search": {
        "get": {
          "tags": ["Location"],
          "summary": "Searching a location by keyword",
          "description": "Returns locations based on the provided town and/or province.",
          "operationId": "getLocationByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "town",
              "in": "query",
              "description": "Town keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "province",
              "in": "query",
              "description": "Province keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Isolate"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "At least one of 'town' or 'province' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location/create": {
        "post": {
          "tags": ["Location"],
          "summary": "Create new location",
          "description": "Creates a new location in the database",
          "operationId": "createLocation",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Location data for creation",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "location_code": { "type": "string" },
                    "town": { "type": "string" },
                    "province": { "type": "string" }
                  },
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Location Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Location successfully created." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "Missing required fields."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "409": {
              "description": "Conflict",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Conflict",
                    "message": "Location with location code or town already exists."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location/update/{id}": {
        "patch": {
          "tags": ["Location"],
          "summary": "Update location by ID",
          "description": "Updates an existing location in the database by ID",
          "operationId": "updateLocation",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the location to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Location data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "location_code": { "type": "string" },
                    "town": { "type": "string" },
                    "province": { "type": "string" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Location Updated",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Location successfully updated." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Location with specified ID not found."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/location/delete/{id}": {
        "delete": {
          "tags": ["Location"],
          "summary": "Delete location by ID",
          "description": "Deletes a location based on the provided ID.",
          "operationId": "deleteLocation",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the location to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Location Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Location successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Location with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave": {
        "get": {
          "tags": ["Cave"],
          "summary": "Get all caves",
          "description": "Returns all caves in the database.",
          "operationId": "getAllCaves",
          "produces": ["application/json"],
          "parameters": [
              {
                "name": "page",
                "in": "query",
                "description": "Page number for pagination",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "limit",
                "in": "query",
                "description": "Number of items to return per page",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              }
          ],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/Cave"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No caves found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],

                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave/{id}": {
        "get": {
          "tags": ["Cave"],
          "summary": "Get a cave by ID",
          "description": "Returns a cave based on the provided ID.",
          "operationId": "getCaveById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the cave to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Cave"
                  }
                }
              }
            },
            "404": {
              "description": "Cave not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Cave not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave/search": {
        "get": {
          "tags": ["Cave"],
          "summary": "Searching a cave by keyword",
          "description": "Returns caves based on the provided cave.",
          "operationId": "getCaveByKeyword",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "cave",
              "in": "query",
              "description": "Cave keyword for searching",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Cave"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'cave' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave/create": {
        "post": {
          "tags": ["Cave"],
          "summary": "Create new cave",
          "description": "Creates a new cave in the database",
          "operationId": "createCave",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Cave data for creation",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "cave_code": { "type": "string" },
                    "name": { "type": "string" },
                    "town": { "type": "string" },
                    "province": { "type": "string" }
                  },
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Cave Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Cave successfully created." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "Missing required fields."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Location with specified town and province not found."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave/update/{id}": {
        "patch": {
          "tags": ["Cave"],
          "summary": "Update cave by ID",
          "description": "Updates an existing cave in the database by ID",
          "operationId": "updateCave",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the cave to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Cave data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "cave_code": { "type": "string" },
                    "name": { "type": "string" },
                    "town": { "type": "string" },
                    "province": { "type": "string" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cave Updated",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Cave successfully updated." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Cave with specified ID not found."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/cave/delete/{id}": {
        "delete": {
          "tags": ["Cave"],
          "summary": "Delete cave by ID",
          "description": "Deletes a cave based on the provided ID.",
          "operationId": "deleteCave",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the cave to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Cave Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Cave successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Cave with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint": {
        "get": {
          "tags": ["Sampling Point"],
          "summary": "Get all sampling points",
          "description": "Returns all sampling points in the database.",
          "operationId": "getAllSamplingPoints",
          "produces": ["application/json"],
          "parameters": [
              {
                "name": "page",
                "in": "query",
                "description": "Page number for pagination",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "limit",
                "in": "query",
                "description": "Number of items to return per page",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              }
          ],
          "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                      "schema": {
                          "type": "array",
                          "items": {
                              "$ref": "#/components/schemas/SamplingPoint"
                          }
                      }
                  }
                }      
              },
              "204": {
                "description": "No sampling points found",
                "content": {
                  "application/json": {
                    "example": {
                      "isolates": [],
                    }
                  }
                }
              },
              "401": {
                "description": "Unauthorized",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Unauthorized",
                      "message": "User is not authorized to access this resource."
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "content": {
                  "application/json": {
                    "example": {
                      "error": "Internal Server Error",
                      "message": "An internal server error occurred while processing the request."
                    }
                  }
                }
              }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint/{id}": {
        "get": {
          "tags": ["Sampling Point"],
          "summary": "Get a sampling point by ID",
          "description": "Returns a sampling point based on the provided ID.",
          "operationId": "getSamplingPointById",
          "produces": ["application/json"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sampling point to be retrieved",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SamplingPoint"
                  }
                }
              }
            },
            "404": {
              "description": "Sampling point not found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sampling point not found with the provided ID."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint/search": {
        "get": {
          "tags": ["Sampling Point"],
          "summary": "Get sampling points by keyword",
          "description": "Retrieves sampling points based on a keyword search for a cave",
          "operationId": "getSamplingPointByKeyword",
          "parameters": [
            {
              "name": "cave",
              "in": "query",
              "description": "Keyword for searching caves",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "produces": ["application/json"],
          "responses": {
            "200": {
              "description": "Successful Response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/SamplingPoint"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "'cave' is required for search."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint/create": {
        "post": {
          "tags": ["Sampling Point"],
          "summary": "Create new sampling point",
          "description": "Creates a new sampling point in the database",
          "operationId": "createSamplingPoint",
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Sampling point data for creation",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "description": { "type": "string" }
                  },
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Sampling Point Created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Sampling point successfully created." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "Missing required field."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Cave with specified name not found."
                  }
                }
              }
            },
            "409": {
              "description": "Conflict",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Conflict",
                    "message": "Sampling point with specified cave_id and description already exists."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint/update/{id}": {
        "patch": {
          "tags": ["Sampling Point"],
          "summary": "Update sampling point by ID",
          "description": "Updates an existing sampling point in the database by ID",
          "operationId": "updateSamplingPoint",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sampling point to be updated",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "consumes": ["application/json"],
          "produces": ["application/json"],
          "requestBody": {
            "description": "Sampling point data for update",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "description": { "type": "string" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Sampling Point Updated",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": { "type": "string", "example": "Sampling point successfully updated." }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Bad Request",
                    "message": "No data provided for update."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to access this resource."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sampling point with specified ID not found."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
      "/samplingPoint/delete/{id}": {
        "delete": {
          "tags": ["Sampling Point"],
          "summary": "Delete sampling point by ID",
          "description": "Deletes a sampling point based on the provided ID.",
          "operationId": "deleteSamplingPoint",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the sampling point to be deleted",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Sampling point Deleted",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Sampling point successfully deleted."
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Not Found",
                    "message": "Sampling point with the provided ID not found in the database."
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Unauthorized",
                    "message": "User is not authorized to delete this resource."
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "example": {
                    "error": "Internal Server Error",
                    "message": "An internal server error occurred while processing the request."
                  }
                }
              }
            }
          },
          "security": [
            {
              "Authentication": []
            }
          ]
        }
      },
    },
    components: {
      "securitySchemes": {
        "Authentication": {
          "type": "apiKey",
          "in": "header",
          "name": "Authorization"
        }
      },
      "schemas": {
          "Isolate": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the isolate"
                  },
                  "code": {
                      "type": "string",
                      "description": "The unique code for the isolate"
                  },
                  "genus": {
                      "type": "string",
                      "description": "The genus of the isolate"
                  },
                  "species": {
                      "type": "string",
                      "description": "The species of the isolate"
                  },
                  "organism": {
                      "$ref": "#/components/schemas/Organism",
                  },
                  "sample": {
                      "$ref": "#/components/schemas/Sample",
                  },
                  "host": {
                      "$ref": "#/components/schemas/Host",
                  },
                  "method_id": {
                      "$ref": "#/components/schemas/Method",
                  },
                  "cave": {
                    "$ref": "#/components/schemas/Cave",
                  },
                  "sampling_point": {
                      "$ref": "#/components/schemas/SamplingPoint",
                  },
                  "institution": {
                      "$ref": "#/components/schemas/Institution",
                  },
                  "collection": {
                      "$ref": "#/components/schemas/Collection",
                  },
                  "access_level": {
                      "type": "string",
                      "description": "The access level of the isolate"
                  }
              }
          },
          "Organism": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the organism"
                  },
                  "organism_type": {
                      "type": "string",
                      "description": "The type of the organism"
                  },
                  "value": {
                      "type": "integer",
                      "description": "The value of the organism"
                  }
              }
          },
          "Sample": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the sample"
                  },
                  "sample_type": {
                      "type": "string",
                      "description": "The type of the sample"
                  }
              }
          },
          "Host": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the host"
                  },
                  "host_type": {
                      "type": "string",
                      "description": "The type of the host"
                  },
                  "host_genus": {
                      "type": "string",
                      "description": "The genus of the host"
                  },
                  "host_species": {
                      "type": "string",
                      "description": "The species of the host"
                  },
              }
          },
          "Method": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the method"
                  },
                  "method": {
                      "type": "string",
                      "description": "The type of the method"
                  }
              }
          },
          "Location": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the location"
                  },
                  "location_code": {
                      "type": "string",
                      "description": "The code of the location"
                  },
                  "town": {
                      "type": "string",
                      "description": "The town of the location"
                  },
                  "province": {
                      "type": "string",
                      "description": "The province of the location"
                  },
              }
          },
          "Cave": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the cave"
                  },
                  "cave_code": {
                      "type": "string",
                      "description": "The code of the cave"
                  },
                  "name": {
                      "type": "string",
                      "description": "The name of the cave"
                  },
                  "location": {
                      "$ref": "#/components/schemas/Location",
                  },
              }
          },
          "SamplingPoint": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the sampling point"
                  },
                  "description": {
                      "type": "string",
                      "description": "The description of the sampling point"
                  }
              }
          },
          "Institution": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the institution"
                  },
                  "institution_code": {
                      "type": "string",
                      "description": "The code of the institution"
                  },
                  "name": {
                      "type": "string",
                      "description": "The name of the institution"
                  },
              }
          },
          "Collection": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the collection"
                  },
                  "colllection_code": {
                      "type": "string",
                      "description": "The code of the collection"
                  },
                  "name": {
                      "type": "string",
                      "description": "The name of the collection"
                  },
              }
          },
          "User": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the user"
                  },
                  "first_name": {
                      "type": "string",
                      "description": "The first name of the user"
                  },
                  "last_name": {
                      "type": "string",
                      "description": "The last name of the user"
                  },
                  "username": {
                      "type": "string",
                      "description": "The username of the user"
                  },
                  "email": {
                      "type": "string",
                      "description": "The email of the user"
                  },
                  "password": {
                      "type": "string",
                      "description": "The password of the user"
                  },
                  "role": {
                      "$ref": "#/components/schemas/Role",
                  }
              }
          },
          "Role": {
              "type": "object",
              "properties": {
                  "id": {
                      "type": "integer",
                      "description": "The unique identifier for the role"
                  },
                  "role_name": {
                      "type": "string",
                      "description": "The name of the role"
                  }
              }
          },
      }
    }
  },
  apis: ['./routes/*.js'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
