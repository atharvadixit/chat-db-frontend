# Chat-DB-Frontend

## Overview
This project is a React-based frontend application designed to interact with a database (MySQL or MongoDB). Users can learn database concepts, run predefined queries, and execute custom queries on their databases.

---

## Installation and Setup

### Prerequisites
- Node.js and npm installed on your machine

### Steps to Run
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd chat-db-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the application in your browser at:
   ```
   http://localhost:3000
   ```
---

## File Structure

### Root Directory
- **package.json**: Lists the dependencies and scripts for the project.
- **package-lock.json**: Tracks the dependency tree for consistent installations.
- **.gitignore**: Specifies files and directories to be ignored by Git.

### Public Directory
- **index.html**: The main HTML template for the React application.
- **favicon.ico**: The favicon for the application.

### Src Directory
- **App.js**: The main entry point of the React application.
- **index.js**: Renders the application and attaches it to the DOM.
- **App.css**: Global CSS for the application.
- **index.css**: Additional global styling.
- **logo.svg**: Placeholder for the logo image.
- **reportWebVitals.js**: Used for measuring performance metrics.
- **setupTests.js**: Test setup for the application.

### Src/Components Directory
This directory contains the React components used in the application.

1. **ChatComponent.js**: Handles the chat-like interface for interacting with the database. Users can view query suggestions, run predefined queries, and see results.

2. **DatabaseDetails.js**: Displays details of the selected database (e.g., tables for MySQL or collections for MongoDB) with a preview of their contents.

3. **DatabaseList.js**: Lists all available databases and allows users to select one to learn.

4. **HomePage.js**: The landing page of the application that provides an overview and navigation to the available features.

5. **LearningPage.js**: The main learning interface where users can interact with the database. Includes a chat component and a custom query feature.

6. **Navbar.js**: Provides navigation options for the application.

7. **UploadDataSet.js**: Allows users to upload datasets to the backend.

### Css Directory
Contains stylesheets for the components.

1. **ChatComponent.css**: Custom styles for the chat interface.
2. **index.css**: Additional styles shared across components.

---

## Usage
1. **Learning Database Concepts**:
   - Navigate to the Learning Page.
   - Interact with the chat interface to learn about predefined queries.

2. **Running Custom Queries**:
   - Click the "Run Custom Query" link.
   - Enter your custom query in the modal.
   - View results in a table (MySQL) or as JSON (MongoDB).

3. **Uploading Datasets**:
   - Use the upload feature to add new data to the backend.

---

## Future Enhancements
- Add authentication for secure access.
- Improve UI/UX with enhanced feedback mechanisms.
- Support additional database types.