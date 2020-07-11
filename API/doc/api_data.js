define({ "api": [
  {
    "type": "INTRODUCTION",
    "url": "Function/Overview",
    "title": "1.2 Function overview",
    "group": "1Overview",
    "description": "<p>This API can handle a lot of functionalism's. Here comes a short collection of the most important functions.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "Server-Information",
            "description": "<p>Show vital information of the server, version number</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "User-Management",
            "description": "<p>Create, read, update and delete users. Manage friendships and meetings. Notify users via push notifications</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "Meal-Management",
            "description": "<p>Manage, like, comment and rate meals. Up- and download images of meals.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "Building-Management",
            "description": "<p>Manage buildings. Up- and download images of buildings</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "Washing-Machine-Overview",
            "description": "<p>View the state of washing machines</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "Feedback-Management",
            "description": "<p>Manage Feedback from users</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "doc/customDocumentation/1overview.js",
    "groupTitle": "1. Overview",
    "groupDescription": "<p>Welcome to the API Documentation of EMSA. There are a lot of informations in here. I recommend you to read at least the small 4 Chapters 1-4 and then you should be good enough prepared to handle this API. This Document can be found in /ESMA/API/doc/customDocumentation/1overview.js. ! If you make any changes in the documentation please run the command &quot;npm run doc&quot; to generate this document.</p>",
    "name": "IntroductionFunctionOverview"
  },
  {
    "type": "INTRODUCTION",
    "url": "REST/API",
    "title": "1.1 REST API Choice",
    "group": "1Overview",
    "description": "<p>A lot of systems communicate with them self. To support this communication a REST API is a good possibility. A REST API can combine multiple interface and task, so that a shared access from anywhere in a network is possible. Every device which supports a network communication can use the REST API. Further functions can be implemented with low effort.</p>",
    "version": "0.0.0",
    "filename": "doc/customDocumentation/1overview.js",
    "groupTitle": "1. Overview",
    "groupDescription": "<p>Welcome to the API Documentation of ESMA. There are a lot of informations in here. I recommend you to read at least the small 4 Chapters 1-4 and then you should be good enough prepared to handle this API. This Document can be found in /ESMA/API/doc/customDocumentation/1overview.js. ! If you make any changes in the documentation please run the command &quot;npm run doc&quot; to generate this document.</p>",
    "name": "IntroductionRestApi"
  },
  {
    "type": "INTRODUCTION",
    "url": "JavascriptGet",
    "title": "2.1 GET Request",
    "group": "2Client",
    "description": "<p>In this example our client want to receive a meal from the API. Therefore we assume we got authentication headers, which will be explained in the next section.</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "var server = \"https://localhost/api/\";\nvar mealID = 123;\nvar resource_url = \"meals/\"+mealID+\"/\";\n\nasync function getMeal(){\n   // define the content type of our sending information\n   let headers = new Headers({\n       'Content-Type': 'application/json'\n   });\n\n   // create request to the server\n   let response = await fetch(server+resource_url, {\n       method: \"GET\",\n       credentials: 'include',\n       headers: headers,\n   });\n\n   // return our response\n   return response.json();\n}",
          "type": "js"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "doc/customDocumentation/2client.js",
    "groupTitle": "2. Clients",
    "groupDescription": "<p>To communicate with the API clients are needed. All clients just need the HTTP Methods and a network connection to the API. In the following we will focus on Javascript clients. We assume that the API is reachable at the URL: &quot;https://localhost&quot;, in some real cases you need to specify a port.</p>",
    "name": "IntroductionJavascriptget"
  },
  {
    "type": "INTRODUCTION",
    "url": "JavascriptPost",
    "title": "2.2 POST Request",
    "group": "2Client",
    "description": "<p>In this example our client want to update a meal with a new name. Beseide POST Request there are also DELETE and PUT requests. In our API instead of PUT request, we use POST requests.</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "var payload_json = {name: \"new name\"};\nvar payload = JSON.stringify(payload_json);\n\nvar server = \"https://localhost/api/\";\nvar mealID = 123;\nvar resource_url = \"meals/\"+mealID+\"/\";\n\nasync function updateMeal(){\n    // create request to the server\n    let response = await fetch(server+resource_url, {\n           method: \"POST\",\n           credentials: 'include',\n           headers: headers,\n           body: payload,\n    });\n\n    // return our response\n    return response.json();\n }",
          "type": "js"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "doc/customDocumentation/2client.js",
    "groupTitle": "2. Clients",
    "groupDescription": "<p>To communicate with the API clients are needed. All clients just need the HTTP Methods and a network connection to the API. In the following we will focus on Javascript clients. We assume that the API is reachable at the URL: &quot;https://localhost&quot;, in some real cases you need to specify a port.</p>",
    "name": "IntroductionJavascriptpost"
  },
  {
    "type": "INTRODUCTION",
    "url": "AdminAuthentication",
    "title": "3.1 Admin",
    "group": "3Auth",
    "description": "<p>To get an admin role you need to run request on the same machine/IP. This can be achieved via an proxy server which has a basic authentication. In this repository there is a proxy server already installed, which only needs to be started.</p>",
    "parameter": {
      "examples": [
        {
          "title": "Admin authentication example:",
          "content": "let username = \"admin\";\nlet password = \"password\";\nlet portProxy = 3002;\nlet url = \"https://localhost:\"+portProxy+\"/api/secretArea\";\n\nlet encoded = btoa(username+\":\"+password); //encoded username and password\n\n//header creation with username and password\nlet headers = new Headers({\n   'Content-Type': 'application/json',\n   'Authorization': 'Basic ' + encoded\n});\n\nfetch(url, { \n   method: 'GET',\n   Accept: 'application/json',\n   headers: headers, //adding headers\n})\n.then((response) => response.json())\n.then((responseJson) => {\n   console.log(responseJson); //receiving response\n});",
          "type": "js"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "doc/customDocumentation/3auth.js",
    "groupTitle": "3. Authentication",
    "groupDescription": "<p>In fact we have some sensible areas in our application which should not be public to everyone. Therefore a authentication is needed. We will differentiate between a direct admin, and a token authentication.</p>",
    "name": "IntroductionAdminauthentication"
  },
  {
    "type": "INTRODUCTION",
    "url": "UserAdminRights",
    "title": "3.3 User/Admin Rights",
    "group": "3Auth",
    "description": "<p>In Order to get information which resources and attributes a specific role can access, take a look at <a href=\"#api-Permission\">Permission</a>'s</p>",
    "version": "0.0.0",
    "filename": "doc/customDocumentation/3auth.js",
    "groupTitle": "3. Authentication",
    "groupDescription": "<p>In fact we have some sensible areas in our application which should not be public to everyone. Therefore a authentication is needed. We will differentiate between a direct admin, and a token authentication.</p>",
    "name": "IntroductionUseradminrights"
  },
  {
    "type": "INTRODUCTION",
    "url": "UserAuthentication",
    "title": "3.2 User",
    "group": "3Auth",
    "description": "<p>In order to authenticate as a user, we first need a user account. The registration as a user can be read here: <a href=\"#api-User-CreateUser\">Create User</a>. After we got a valid user Id and the corresponding password, we can obtain an AccessToken.</p>",
    "parameter": {
      "examples": [
        {
          "title": "User authentication example:",
          "content": " var password = \"password\"; // user password\n var user_id = 123; // user id\n var apiURL = \"https://localhost/api\";\n\n async function getAccessToken(){ // function to obtain an AccessToken\n  let headers = new Headers({\n    'Content-Type': 'application/json',\n  });\n\n  let url = apiURL+\"/users/\"+user_id+\"/newToken\";\n\n  // create auth payload\n  let payloadJSON = {\n    plaintextSecret: password,\n    user_id: user_id\n  }\n\n  // request to server\n  let response = await fetch(url, {\n    method: 'POST',\n    Accept: 'application/json',\n    headers: headers,\n    body: JSON.stringify(payloadJSON) //with credentials\n  });\n  let responseJson = await response.json();\n  return responseJson.accessToken; //return token\n}\n\n\nasync function getUserProfile(){ // function to a user profile\n  let accessToken = await getAccessToken(); //obtain AccessToken\n  // create headers\n let headers = new Headers({\n            Authorization: \"SwosyAccessToken \" + accessToken, //with AccessToken\n            \"Content-Type\": \"application/json\",\n        });\n\n let url = apiURL+\"/user/123/\"; //private profile url\n //request to server\n fetch(url, {\n    method: 'GET',\n    headers: headers,\n})\n .then((response) => response.json())\n .then((responseJson) => { // response of private profile\n    console.log(responseJson);\n});\n}",
          "type": "js"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "doc/customDocumentation/3auth.js",
    "groupTitle": "3. Authentication",
    "groupDescription": "<p>In fact we have some sensible areas in our application which should not be public to everyone. Therefore a authentication is needed. We will differentiate between a direct admin, and a token authentication.</p>",
    "name": "IntroductionUserauthentication"
  },
  {
    "type": "get",
    "url": "/api/version",
    "title": "Get the API version",
    "description": "<p>!! This Route will Never Change !! Get the actual Server API Version number</p>",
    "name": "GetAPIVersion",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "4Custom",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>The actual version of the Server API.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/version",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "4. Custom",
    "groupDescription": "<p>This API uses some very important routes, which are listed here. Other Custom Routes can be found at the Section <a href=\"#api-Custom\">Custom</a>.</p>"
  },
  {
    "type": "MODEL",
    "url": "Device",
    "title": "Device",
    "name": "ModelDevice",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Resource ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "UserId",
            "description": "<p><a href=\"#api-1._Models-ModelUser\">User</a>'s Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pushNotificationToken",
            "description": "<p>The Push-Notification Token of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "os",
            "description": "<p>The operating system of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "version",
            "description": "<p>The version of the device's operating system</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/device.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "MODEL",
    "url": "Feedback",
    "title": "Feedback",
    "name": "ModelFeedback",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Resource ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "UserId",
            "description": "<p><a href=\"#api-1._Models-ModelUser\">User</a>'s Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "message",
            "description": "<p>The message of the Feedback</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "label",
            "description": "<p>A label of the feedback like &quot;bug&quot;, &quot;problem&quot;, ...</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/feedback.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "MODEL",
    "url": "Role",
    "title": "Role",
    "name": "ModelRole",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Resource ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the role</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/role.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "MODEL",
    "url": "StreamView",
    "title": "StreamView",
    "name": "ModelStreamView",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Resource ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "screen",
            "description": "<p>The name of the opened screen in the app</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "eventTime",
            "description": "<p>The date this event occured</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "DeviceId",
            "description": "<p><a href=\"#api-1._Models-ModelDevice\">Device</a>'s Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "event",
            "description": "<p>A special event this event was triggered</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": true,
            "field": "props",
            "description": "<p>Additional properties for this event</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/streamview.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "MODEL",
    "url": "User",
    "title": "User",
    "name": "ModelUser",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Resource ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "privacyPoliceReadDate",
            "description": "<p>The last date the user read the privacy policy</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "CanteenId",
            "description": "<p><a href=\"#api-1._Models-ModelCanteen\">Canteen</a>'s Id in which a user eats</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "ResidenceId",
            "description": "<p><a href=\"#api-1._Models-ModelResidence\">Residence</a>'s Id in which a user lives</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pseudonym",
            "description": "<p>The nickname a user choosed</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"l\"",
              "\"g\"",
              "\"f\""
            ],
            "optional": true,
            "field": "typefood",
            "description": "<p>The foodtags a user likes</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "language",
            "description": "<p>The language a user uses</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": true,
            "field": "avatar",
            "description": "<p>The avatar of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "online_time",
            "description": "<p>The last time the user was online</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/user.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "MODEL",
    "url": "UserRole",
    "title": "UserRole",
    "name": "ModelUserRole",
    "group": "5Models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "UserId",
            "description": "<p><a href=\"#api-1._Models-ModelUser\">UserId</a>'s Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "RoleId",
            "description": "<p><a href=\"#api-1._Models-ModelRole\">Role</a>'s Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "beginnAt",
            "description": "<p>The date the authorization is starting</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": true,
            "field": "endAt",
            "description": "<p>The date the authorization will expired</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>The date the resource was created</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "updatedAt",
            "description": "<p>The date the resource was updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "models/userrole.js",
    "groupTitle": "5. Models",
    "groupDescription": "<p>All models are listed below. All models got a Field &quot;createdAt&quot; and &quot;updatedAt&quot;, these Fields update automatically, dont change them unless you realy need it !</p>"
  },
  {
    "type": "get",
    "url": "/api/functions/backups/:id/create",
    "title": "Create Backup",
    "name": "CreateBackup",
    "description": "<p>With this endpoint an automatic backup will be created</p>",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Backup's unique ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/functions/backups/:id/",
    "title": "Delete Backup File",
    "name": "DeleteBackupFile",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Backup's unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE http://localhost/api/functions/backup/test.gz/",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/functions/backups/:id/download",
    "title": "Download Backup",
    "name": "DownloadBackup",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Backup's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "SQL",
            "optional": false,
            "field": "resource",
            "description": "<p>The compressed SQL File of the backup.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/functions/backups/:id",
    "title": "Get Backup Information",
    "name": "GetBackup",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Backup's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "resource",
            "description": "<p>The information of the backup</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/functions/backups",
    "title": "All Backup Informations",
    "name": "IndexFunctionBackups",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[JSON]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of Backup file informations.</p>"
          }
        ]
      }
    },
    "description": "<p>Lists all backup names</p>",
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/functions/backups/:id/restore",
    "title": "Restore Backup",
    "description": "<p>Caution ! This will reset the whole Database to the backup ! Please make a backup before using this !</p>",
    "name": "RestoreBackup",
    "permission": [
      {
        "name": "Admin delete:any create:any Function_Database"
      }
    ],
    "group": "Backup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Backup's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/functions/backups",
    "title": "Upload Backup",
    "name": "UploadBackupFile",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Backup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "multipart/form-data"
            ],
            "optional": false,
            "field": "Content-Type",
            "description": ""
          },
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Request file": [
          {
            "group": "Request file",
            "type": "GZip",
            "optional": false,
            "field": "file",
            "description": "<p>SQL File as GZip</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/Function_BackupController.js",
    "groupTitle": "Backup",
    "groupDescription": "<p>Backups are complete representations of all database informations. Be carefull !</p>"
  },
  {
    "type": "get",
    "url": "/api/custom/showAllEndpoints",
    "title": "Get All Endpoint routes",
    "description": "<p>Shows all possible routes which could be used</p>",
    "name": "GetAllEndpoints",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Custom",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[Routes]",
            "optional": false,
            "field": "Routes",
            "description": "<p>All possible routes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/custom/showAllEndpoints",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "Custom",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/custom/metrics",
    "title": "Get All route Metrics",
    "description": "<p>Shows alot of informations about the server</p>",
    "name": "GetAllMetrics",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Custom",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON[Metrics]",
            "optional": false,
            "field": "Metrics",
            "description": "<p>All metrics for the server routes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/custom/metrics",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "Custom",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/custom/systemInformation",
    "title": "Get All System Informations",
    "description": "<p>Handle System Information Request, which provide all machine based informations</p>",
    "name": "GetAllSystemInformations",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Custom",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[Routes]",
            "optional": false,
            "field": "Routes",
            "description": "<p>All possible routes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>The possible error that can occur. Possible Errors: FORBIDDEN</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/custom/systemInformation",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "Custom",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/custom/photoSchnellerTellerWesterberg",
    "title": "Get main dish Image",
    "description": "<p>Get the Image of the todays main dish in the canteen. Since the Studentenwerk/INFOMax cant handle variable URLs, we create a &quot;static&quot; URL. Since Photos were made in the Canteen Westerberg this URL refers to this canteen.</p>",
    "name": "GetMainDishWesterberg",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "Custom",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Binary",
            "optional": false,
            "field": "Image",
            "description": "<p>Image of the main Dish.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>The possible error that can occur. Possible Errors: NOT_FOUND, INTERNAL_SERVER_ERROR</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/custom/photoSchnellerTellerWesterberg",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "Custom"
  },
  {
    "type": "get",
    "url": "/api/custom/sendNotification",
    "title": "Get All System Informations",
    "description": "<p>Sends Push Notifications to the given Devices</p>",
    "name": "GetSendPushNotification",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Custom",
    "parameter": {
      "fields": {
        "Request message body": [
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title for the push notification</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>The body text for the push notification</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "badge",
            "description": "<p>for iOS Devices the App Notifier number</p>"
          },
          {
            "group": "Request message body",
            "type": "List[String]",
            "optional": false,
            "field": "listOfDeviceIDs",
            "description": "<p>The list of recipients</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[Routes]",
            "optional": false,
            "field": "Routes",
            "description": "<p>All possible routes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/module/MyExpressRouter.js",
    "groupTitle": "Custom",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/devices",
    "title": "Create Device",
    "name": "CreateDevice",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "Device",
    "parameter": {
      "fields": {
        "Request message body": [
          {
            "group": "Request message body",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>The <a href=\"#api-5Models-ModelUser\">User</a>'s Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelBuilding\">Building</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The created building.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/devices/:id",
    "title": "Delete Device",
    "name": "DeleteDevice",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Device's unique ID.</p>"
          }
        ]
      }
    },
    "description": "<p>Users can only delete their own resources.</p>",
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/devices/:id",
    "title": "Get Device",
    "name": "GetDevice",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Device's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelDevice\">Device</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The device.</p>"
          }
        ]
      }
    },
    "description": "<p>Users can only get their own resources.</p>",
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/devices/:id/streamviews",
    "title": "Get StreamView of Device",
    "name": "GetStreamViewOfDevice",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Device's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelStreamView\">StreamView</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>The streamviews of a device as list.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/devices",
    "title": "All Devices",
    "name": "IndexDevices",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Device",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelDevice\">Device</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of Device Objects of all Devices.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/devices/:id",
    "title": "Update Device",
    "name": "UpdateDevice",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Device's unique ID.</p>"
          }
        ],
        "Request message body": [
          {
            "group": "Request message body",
            "type": "<a href=\"#api-5Models-ModelDevice\">Device</a>",
            "optional": false,
            "field": "prop",
            "description": "<p>Depending on <a href=\"#api-Permission\">Permission</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelCanteen\">Device</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The updated device.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/DeviceController.js",
    "groupTitle": "Device",
    "groupDescription": "<p>A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/feedbacks",
    "title": "Create Feedback",
    "name": "CreateFeedback",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "Feedback",
    "parameter": {
      "fields": {
        "Request message body": [
          {
            "group": "Request message body",
            "type": "String",
            "optional": true,
            "field": "message",
            "description": "<p>The message of the feedback</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": true,
            "field": "label",
            "description": "<p>A label for the message</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelFeedback\">Feedback</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The feedback.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FeedbackController.js",
    "groupTitle": "Feedback",
    "groupDescription": "<p>A Feedback is an information a user gives about his opinion of the system.</p>",
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/feedback/:id",
    "title": "Delete Feedback",
    "name": "DeleteFeedback",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Feedback",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Feedback's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FeedbackController.js",
    "groupTitle": "Feedback",
    "groupDescription": "<p>A Feedback is an information a user gives about his opinion of the system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/feedbacks/:id",
    "title": "Get Feedback",
    "name": "GetFeedback",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Feedback",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Feedback's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelFeedback\">Feedback</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The feedback.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FeedbackController.js",
    "groupTitle": "Feedback",
    "groupDescription": "<p>A Feedback is an information a user gives about his opinion of the system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/feedbacks",
    "title": "All Feedbacks",
    "name": "IndexFeedbacks",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Feedback",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelFeedback\">Feedback</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of Feedback Objects of all Feedback.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FeedbackController.js",
    "groupTitle": "Feedback",
    "groupDescription": "<p>A Feedback is an information a user gives about his opinion of the system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/feedbacks/:id",
    "title": "Update Feedback",
    "name": "UpdateFeedback",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Feedback",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Feedback's unique ID.</p>"
          }
        ],
        "Request message body": [
          {
            "group": "Request message body",
            "type": "<a href=\"#api-5Models-ModelFeedback\">Feedback</a>",
            "optional": false,
            "field": "prop",
            "description": "<p>Depending on <a href=\"#api-Permission\">Permission</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelFeedback\">Feedback</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The updated feedback.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FeedbackController.js",
    "groupTitle": "Feedback",
    "groupDescription": "<p>A Feedback is an information a user gives about his opinion of the system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/friends",
    "title": "All Friends",
    "name": "IndexFriends",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Friends",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelFriend\">Friend</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of Friend Objects of all Friend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/FriendController.js",
    "groupTitle": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/permissions/own",
    "title": "Get Permissions",
    "name": "GetPermissions",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "Permission",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON[Role[Model[Action]]]",
            "optional": false,
            "field": "permission",
            "description": "<p>JSON Object of own permissions depending on own role.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/PermissionController.js",
    "groupTitle": "Permission",
    "groupDescription": "<p>For almost all Endpoints in this API permissions are needed. Detailed information can be obtained in the File: &quot;src/module/MyAccessControl.js&quot;.You can view <a href=\"#api-Permission-IndexPermissions\">All Permissions</a> or depending on your role at <a href=\"#api-Permission-GetPermissions\">Get Permissions</a>. Permissions will be used to filter attributes of requests. Some requests will fail with insufficient Permissions and the response will contain a HTTP-Code &quot;FORBIDDEN&quot; then.</p>"
  },
  {
    "type": "get",
    "url": "/api/permissions",
    "title": "All Permissions",
    "name": "IndexPermissions",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Permission",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON[Role[Model[Action]]]",
            "optional": false,
            "field": "permission",
            "description": "<p>JSON Object of all permissions.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/PermissionController.js",
    "groupTitle": "Permission",
    "groupDescription": "<p>For almost all Endpoints in this API permissions are needed. Detailed information can be obtained in the File: &quot;src/module/MyAccessControl.js&quot;.You can view <a href=\"#api-Permission-IndexPermissions\">All Permissions</a> or depending on your role at <a href=\"#api-Permission-GetPermissions\">Get Permissions</a>. Permissions will be used to filter attributes of requests. Some requests will fail with insufficient Permissions and the response will contain a HTTP-Code &quot;FORBIDDEN&quot; then.</p>"
  },
  {
    "type": "delete",
    "url": "/api/roles/:id",
    "title": "Delete Role",
    "name": "DeleteRole",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Role's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/RoleController.js",
    "groupTitle": "Role",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/roles/:id",
    "title": "Get Role",
    "name": "GetRole",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Role's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelRole\">Role</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The Role.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/RoleController.js",
    "groupTitle": "Role",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/roles",
    "title": "All Roles",
    "name": "IndexRoles",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelRole\">Role</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of Role Objects of all Roles.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/RoleController.js",
    "groupTitle": "Role",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/roles/:id",
    "title": "Update Role",
    "name": "UpdateRole",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "Role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Role's unique ID.</p>"
          }
        ],
        "Request message body": [
          {
            "group": "Request message body",
            "type": "<a href=\"#api-5Models-ModelRole\">Role</a>",
            "optional": false,
            "field": "prop",
            "description": "<p>Depending on <a href=\"#api-Permission\">Permission</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelRole\">Role</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The updated role.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/RoleController.js",
    "groupTitle": "Role",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/streamviews",
    "title": "Create Stream View",
    "name": "CreateStreamView",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "StreamView",
    "parameter": {
      "fields": {
        "Request message body": [
          {
            "group": "Request message body",
            "type": "Number",
            "optional": false,
            "field": "device_id",
            "description": "<p>The <a href=\"#api-5Models-ModelDevice\">Device</a>'s Id from where the StreamView comes</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "screen",
            "description": "<p>The corresponding screen</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": true,
            "field": "event",
            "description": "<p>The corresponding screen</p>"
          },
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "eventTime",
            "description": "<p>The corresponding screen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelStreamViw\">StreamView</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The Stream View.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/StreamViewController.js",
    "groupTitle": "StreamView",
    "groupDescription": "<p>StreamViews are a representations of an action a user performs. It can be compared to a history entry.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/streamviews/:id",
    "title": "Delete Stream View",
    "name": "DeleteStreamView",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "StreamView",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Stream View's unique ID.</p>"
          }
        ]
      }
    },
    "description": "<p>Users can only delete their own resources.</p>",
    "version": "0.0.0",
    "filename": "src/controllers/StreamViewController.js",
    "groupTitle": "StreamView",
    "groupDescription": "<p>StreamViews are a representations of an action a user performs. It can be compared to a history entry.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/streamviews/:id",
    "title": "Get Stream View",
    "name": "GetStreamView",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "StreamView",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Stream View's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelStreamView\">StreamView</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The StreamView.</p>"
          }
        ]
      }
    },
    "description": "<p>Users can only get their own resources.</p>",
    "version": "0.0.0",
    "filename": "src/controllers/StreamViewController.js",
    "groupTitle": "StreamView",
    "groupDescription": "<p>StreamViews are a representations of an action a user performs. It can be compared to a history entry.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/streamviews",
    "title": "All Stream Views",
    "name": "IndexStreamViews",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "StreamView",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelStreamView\">StreamView</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of StreamView Objects of all StreamViews.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/StreamViewController.js",
    "groupTitle": "StreamView",
    "groupDescription": "<p>StreamViews are a representations of an action a user performs. It can be compared to a history entry.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/streamviews/:id",
    "title": "Update StreamView",
    "name": "UpdateStreamView",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "StreamView",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>StreamView's unique ID.</p>"
          }
        ],
        "Request message body": [
          {
            "group": "Request message body",
            "type": "<a href=\"#api-5Models-ModelStreamView\">StreamView</a>",
            "optional": false,
            "field": "prop",
            "description": "<p>Depending on <a href=\"#api-Permission\">Permission</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelStreamView\">StreamView</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The updated streamview.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/StreamViewController.js",
    "groupTitle": "StreamView",
    "groupDescription": "<p>StreamViews are a representations of an action a user performs. It can be compared to a history entry.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/usersAmount",
    "title": "Get Amount of Users",
    "name": "AmountUsers",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>The amount of registered users</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
  },
  {
    "type": "post",
    "url": "/api/users/:id/newToken",
    "title": "Create AccessToken",
    "name": "CreateAccessToken",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plaintextSecret",
            "description": "<p>User's password as plain text.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "successfully",
            "description": "<p>On success this is true</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>Here is the AccessToken</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "Content-Type",
            "allowedValues": [
              "\"application/json\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "Create User",
    "name": "CreateUser",
    "permission": [
      {
        "name": "Anonym"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Request message body": [
          {
            "group": "Request message body",
            "type": "String",
            "optional": false,
            "field": "plaintextSecret",
            "description": "<p>The Plaintext password for the User account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>The unique Id of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
  },
  {
    "type": "post",
    "url": "/api/users/:id/friendrequests/:friend_id",
    "title": "Create User FriendRequest",
    "name": "CreateUserFriendRequest",
    "description": "<p>A user can create a friend request to an other user. If both users created a request to each other, they become friends and their requests will be deleted</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>Outgoing FriendRequest's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>The created Friend Id.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/userroles/user/:id/role/:role_id",
    "title": "Create User Role Association",
    "name": "CreateUserRoleAssociation",
    "description": "<p>To assign a Role to a User this Endpoint can be used</p>",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role_id",
            "description": "<p>The <a href=\"#api-5Models-ModelRole\">Role</a> Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUserRole\">UserRole</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The created User Role.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user or role does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserRoleController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/users/:id/friends/:friend_id",
    "title": "Create Users Friend",
    "name": "CreateUsersFriend",
    "description": "<p>An Admin can force a friendship</p>",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>Friend's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>The created Friend Id.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/user/:id",
    "title": "Delete User",
    "name": "DeleteUser",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/users/:id/friends/:user_id",
    "title": "Delete Users Friend",
    "name": "DeleteUsersFriend",
    "description": "<p>To remove a users friend this Endpoint can be used.</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>Friend's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/users/:id/friendrequests/:user_id",
    "title": "Delete Users FriendRequest",
    "name": "DeleteUsersFriendRequest",
    "description": "<p>To delete a users friendrequest this Endpoint can be used.</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>Friend's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id/device",
    "title": "Get Device of User",
    "name": "GetDeviceOfUser",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "resource",
            "description": "<p>The <a href=\"#api-5Models-ModelDevice\">Device</a>'s Id.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "Get User",
    "name": "GetUser",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUser\">User</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id/friends/:friend_id",
    "title": "Get Users Friend",
    "name": "GetUsersFriend",
    "description": "<p>A User can get more information about his friend with this action</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>Friend's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUser\">User</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The Users Friend.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is no friendship or that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id/friendrequests/:friend_id",
    "title": "Get Users FriendRequest",
    "name": "GetUsersFriendRequest",
    "description": "<p>A User can check if there is a friend request to a specific user</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "friend_id",
            "description": "<p>To check outgoing FriendRequest's <a href=\"#api-5Models-ModelUser\">User</a> Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUser\">User</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The Users on his FriendRequest list.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is no friend request outgoing to that user or that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id/friendrequests",
    "title": "Get Users Outgoing FriendRequests",
    "name": "GetUsersFriendRequests",
    "description": "<p>All outgoing FriendRequests a user created</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelUser\">User</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>The Outgoing FriendRequest <a href=\"#api-5Models-ModelUser\">User</a>'s as list.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users/:id/friends",
    "title": "Get Users Friends",
    "name": "GetUsersFriends",
    "description": "<p>A user can have a friendship with an other user. This lists all his friends</p>",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelUser\">User</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>The Friends <a href=\"#api-5Models-ModelUser\">User</a> as list.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "All Users",
    "name": "IndexUsers",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelUser\">User</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of User Objects of all Users</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/api/userroles/user/:user_id/",
    "title": "Delete User Role",
    "name": "DeleteUserRole",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "UserRole",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role_id",
            "description": "<p>User's unique Role ID.</p>"
          }
        ]
      }
    },
    "description": "<p>Users can only delete their own resources.</p>",
    "version": "0.0.0",
    "filename": "src/controllers/UserRoleController.js",
    "groupTitle": "UserRole",
    "groupDescription": "<p>User's can have different Roles. This association is represented by the table UserRoles.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>On success this is true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/userroles/user/:id",
    "title": "Get User Role",
    "name": "GetUserRole",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "UserRole",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUserRole\">UserRole</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The User Role association.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserRoleController.js",
    "groupTitle": "UserRole",
    "groupDescription": "<p>User's can have different Roles. This association is represented by the table UserRoles.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/userroles",
    "title": "All User Roles",
    "name": "IndexUserRoles",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "UserRole",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List[<a href=\"#api-5Models-ModelUserRole\">UserRole</a>]",
            "optional": false,
            "field": "resources",
            "description": "<p>List of UserRole Objects of all UserRole associations.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserRoleController.js",
    "groupTitle": "UserRole",
    "groupDescription": "<p>User's can have different Roles. This association is represented by the table UserRoles.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/users/:id",
    "title": "Update User",
    "name": "UpdateUser",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          }
        ],
        "Request message body": [
          {
            "group": "Request message body",
            "type": "<a href=\"#api-5Models-ModelUser\">User</a>",
            "optional": false,
            "field": "prop",
            "description": "<p>Depending on <a href=\"#api-Permission\">Permission</a></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-5Models-ModelUser\">User</a>",
            "optional": false,
            "field": "resource",
            "description": "<p>The updated user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "allowedValues": [
              "\"Authorization TOKEN\""
            ],
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND</p>"
          },
          {
            "group": "Error",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>A description of the error</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/users/:id/privacyPoliceRead",
    "title": "Update Privacy Policy Read Timestamp",
    "name": "UserUpdatePrivacyPolicy",
    "permission": [
      {
        "name": "User",
        "title": "User",
        "description": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>"
      }
    ],
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plaintextSecret",
            "description": "<p>User's password as plain text.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "successfully",
            "description": "<p>On success this is true</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>Here is the AccessToken</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/UserController.js",
    "groupTitle": "User",
    "groupDescription": "<p>Deletion will cause deletion of: Device, MealComments, MealRatings, Login</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "Content-Type",
            "allowedValues": [
              "\"application/json\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    }
  }
] });
