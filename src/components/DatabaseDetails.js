import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Accordion, Container, Alert, Spinner } from "react-bootstrap";
import "../css/DatabaseDetails.css";
import axios from "axios";

const DatabaseDetails = () => {
    const { dbType, dbName } = useParams(); // Get the database type and name from the URL
    const [tables, setTables] = useState([]); // State for tables/collections
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState(""); // State for error handling
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show loading spinner
            setError(""); // Reset error
            try {
                const response = await axios.get("http://127.0.0.1:3001/fetch-data", {
                    params: { dbType, dbName }, // Pass dbType and dbName as query parameters
                });
                if (dbType === "mysql") {
                    setTables(response.data.tables || []); // Handle MySQL response
                } else if (dbType === "mongodb") {
                    setTables(response.data.collections || []); // Handle MongoDB response
                } else {
                    setTables([]); // Default to empty if unsupported dbType
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data from the server."); // Set error state
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };

        fetchData(); // Fetch data when component mounts
    }, [dbType, dbName]);

    // Handle the click to navigate to the learning page
    const handleStartLearningClick = () => {
        navigate(`/learn/${dbType}/${dbName}`); // Navigate to the new page with dbType and dbName
    };

    return (
        <Container className="database-details-container">
            <h2 className="text-center">
                {dbName} Database {dbType === "mysql" ? "Tables" : "Collections"}
            </h2>

            {/* Start Learning Link */}
            <p className="text-center mt-2">
                Start learning <strong>{dbType === "mysql" ? "MySQL" : "MongoDB"}</strong> using this database.{" "}
                <span
                    className="learn-link"
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={handleStartLearningClick}
                >
                    Click here
                </span>
            </p>

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {/* Tables/Collections Accordion */}
            {!loading && !error && tables.length > 0 && (
                <Row className="mt-4 justify-content-center">
                    <Col xs={12} md={10}>
                        <Accordion>
                            {tables.map((table, index) => (
                                <Accordion.Item eventKey={index.toString()} key={table.name}>
                                    <Accordion.Header>{table.name}</Accordion.Header>
                                    <Accordion.Body>
                                        {dbType === "mysql" ? (
                                            <>
                                                {/* Table Columns */}
                                                <h5>Columns:</h5>
                                                <ul>
                                                    {table.columns.map((col, colIndex) => (
                                                        <li key={colIndex}>{col}</li>
                                                    ))}
                                                </ul>

                                                {/* Sample Data */}
                                                <h5>Sample Data:</h5>
                                                <div style={{ overflowX: "auto" }}>
                                                {table.sampleData.length > 0 ? (
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                {table.columns.map((col, colIndex) => (
                                                                    <th key={colIndex}>{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.sampleData.map((row, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    {table.columns.map((col, colIndex) => (
                                                                        <td key={colIndex}>{row[col]}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>No sample data available for this table.</p>
                                                )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* MongoDB Collection Data */}
                                                <h5>Sample Documents (JSON):</h5>
                                                {table.sampleData.length > 0 ? (
                                                    <pre className="json-display">
                                                        {JSON.stringify(
                                                            table.sampleData.slice(0, 10), // Show only the first 10 documents
                                                            null,
                                                            2
                                                        )}
                                                    </pre>
                                                ) : (
                                                    <p>No documents available for this collection.</p>
                                                )}
                                            </>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            )}

            {/* Handle empty tables state */}
            {!loading && !error && tables.length === 0 && (
                <p className="text-center">No tables or collections found for this database.</p>
            )}
        </Container>
    );
};

export default DatabaseDetails;