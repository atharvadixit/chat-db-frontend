import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";

const UploadDataset = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        const formData = new FormData();
        for (let file of selectedFiles) {
            formData.append("files", file); // Append each file to FormData
        }

        try {
            const response = await axios.post("http://localhost:3001/upload", formData, {
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
    };

    return (
        <Container className="mt-5">
            <h2>Upload Your Dataset</h2>
            <Form>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Choose CSV files</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleUpload}>
                    Upload
                </Button>
            </Form>
        </Container>
    );
};

export default UploadDataset;
