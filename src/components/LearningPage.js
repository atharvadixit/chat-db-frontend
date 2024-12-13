import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChatComponent from "./ChatComponent";
import { Container, Button, Modal, Table, Form } from "react-bootstrap";
import "../css/LearningPage.css";

const LearningPage = () => {
    const { dbName, dbType } = useParams(); // Get dbName and dbType from the URL

    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [query, setQuery] = useState(""); // User-entered query
    const [queryResult, setQueryResult] = useState(null); // Query results state
    const [loading, setLoading] = useState(false); // Loading state for query execution
    const [error, setError] = useState(null); // Error state

    const handleRunQuery = async () => {
        if (!query.trim()) {
            setError("Query cannot be empty.");
            return;
        }

        setError(null); // Reset error state
        setLoading(true); // Start loading
        setQueryResult(null); // Reset previous results

        try {
            const response = await fetch("http://localhost:3001/api/run-query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, dbName, dbType }),
            });

            const data = await response.json();
            if (response.ok) {
                setQueryResult(data.result);
            } else {
                setError(data.error || "Failed to execute query.");
            }
        } catch (err) {
            console.error("Error executing query:", err);
            setError("An error occurred while executing the query.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const renderQueryResults = () => {
        if (!queryResult) return null;

        if (dbType === "mysql") {
            // Display results in a table for MySQL
            if (Array.isArray(queryResult) && queryResult.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {Object.keys(queryResult[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {queryResult.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, colIndex) => (
                                        <td key={colIndex}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            } else {
                return <p>No results to display.</p>;
            }
        } else if (dbType === "mongodb") {
            // Display results as JSON for MongoDB
            return (
                <pre style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {JSON.stringify(queryResult, null, 2)}
                </pre>
            );
        }

        return <p>Unsupported database type.</p>;
    };

    return (
        <div>
            <Container>
            <center>
                <p>
                    You are learning {dbType === "mysql" ? "MySQL" : "MongoDB"} from the{" "}
                    {dbName} database.{" "}
                    <span
                        style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        Run your own query
                    </span>
                </p>
            </center>


                <div style={{ marginTop: "20px" }}>
                    <ChatComponent dbName={dbName} dbType={dbType} />
                </div>
            </Container>

            {/* Modal for Custom Query */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal-width">
                <Modal.Header closeButton>
                    <Modal.Title>Run Custom Query</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="customQuery">
                        <Form.Label>Enter your query:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Enter a ${dbType === "mysql" ? "SQL" : "MongoDB"} query...`}
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {loading && <p>Loading...</p>}
                    {renderQueryResults()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRunQuery} disabled={loading}>
                        Run
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LearningPage;

