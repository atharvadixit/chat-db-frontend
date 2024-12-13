import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import databaseData from "../data/databases.json"; // Import the JSON file
import '../css/DatabaseList.css';

const DatabaseList = () => {
    const {dbType} = useParams();
    const[databases, setDatabases] = useState([]);
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState(null); // Store selected files

    useEffect(() => {
        // Simulating fetching the data based on dbType
        if (databaseData[dbType]) {
          setDatabases(databaseData[dbType]);
        } else {
          setDatabases([]); // If dbType not found, set an empty array
        }
      }, [dbType]);

      const rows = [];
      for (let i = 0; i < databases.length; i += 2) {
          rows.push(databases.slice(i, i + 2));
      }

      // Handle navigation to database details page
    const handleCardClick = (dbName) => {
        navigate(`/database/${dbType}/${dbName}`); // Navigate to the selected database's details page
    };

    // Handle file selection and upload
    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        setSelectedFiles(files);

        const formData = new FormData();
        for (let file of files) {
            formData.append("files", file); // Add files to FormData
        }
        formData.append("dbType", dbType); // Add database type to FormData

        try {
            const response = await axios.post("http://127.0.0.1:3001/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Files uploaded successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Failed to upload files.");
        }
        navigate(`/database/${dbType}/userdatabase`);
    };

    return(
        <Container className="database-list-container">
            <h2 className="text-center">Available {dbType == "mysql" ? "MySQL" : "MongoDB"} Databases</h2>
            <p class="text-[18px]">Select the database you'd like to explore.</p>

            {/* Upload Dataset Card */}
            <Row className="g-4 mt-3 justify-content-center">
                <Col xs={9} sm={4} md={4} lg={4} className="d-flex justify-content-center">
                    <Card className="clickable-card custom-card h-100 w-100">
                        <label
                            htmlFor="file-upload" // Link label to input
                            style={{ cursor: "pointer", width: "100%", margin: 0 }}
                        >
                            <Card.Body>
                                <Card.Title>Upload your own dataset ✨</Card.Title>
                                <Card.Text className="pt-2">
                                    Upload dataset of your choice in CSV format and start learning!
                                </Card.Text>
                            </Card.Body>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".csv"
                            style={{ display: "none" }} // Hide the input
                            onChange={handleFileChange} // Handle file change
                        />
                    </Card>
                </Col>
            </Row>

            {/* Database Cards */}
            {rows.map((row, rowIndex) => (
            <Row className="g-4 mt-3 justify-content-center" key={rowIndex}>
                {row.map((db) => (
                <Col xs={9} sm={4} md={4} lg={4} className="d-flex justify-content-center" key={db.name}>
                    <Card className="clickable-card custom-card h-100 w-100" 
                    onClick={() => handleCardClick(db.name)}>
                    <Card.Body>
                        <Card.Title>{db.name + " " + db.emoji}</Card.Title>
                        <Card.Text className="pt-2">{db.description}</Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
            ))}
        </Container>
    )
}

export default DatabaseList;