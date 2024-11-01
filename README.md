This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# React Redux CRUD with json-server

This repository demonstrates a simple CRUD (Create, Read, Update, Delete) application built using React and Redux, integrated with a mock API server powered by json-server.

#### Features:

Create, Read, Update, and Delete operations on user data.
Utilizes Redux for state management to ensure a single source of truth.
Utilizes json-server to simulate a REST API for storing and retrieving user data.

### Project Setup for React Redux CRUD with json-server

1. Clone the Repository:
```
git clone <repository-url>
```

2. Install Dependencies:
Navigate to the project directory and install the project dependencies using npm install command.

3. Start the Development Server:
```
npm start
```

This will launch the React app in your default web browser. You can access it at http://localhost:3000.

4. Run json-server for Mock API:
```
json-server --watch src/Userdata/data.json --port 3001
```

This will start the mock API server, and you can access the API at http://localhost:3001.
