import React, { useState } from "react";
import { Container, Row, Col, Table, Modal, Button } from "react-bootstrap";
import "../css/ChatComponent.css";

const ChatComponent = ({ dbName, dbType }) => {
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [userInput, setUserInput] = useState(""); // State to store user input
    const [loading, setLoading] = useState(false); // To show a loading indicator when awaiting response
    const [modalLoading, setModalLoading] = useState(false); // To show loading indicator for modal
    const [queryResult, setQueryResult] = useState(null); // State to store query result
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const sendMessage = async () => {
        if (userInput.trim() === "") return;
    
        const newMessages = [...messages, { type: "user", text: userInput }];
        setMessages(newMessages);
        setUserInput("");
    
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3001/api/ask-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: userInput,
                    dbName,
                    dbType,
                }),
            });
    
            const data = await response.json();
    
            if (dbType.toLowerCase() === "mysql") {
                if (data.queries && Array.isArray(data.queries)) {
                    // Handle multiple MySQL queries
                    setMessages([
                        ...newMessages,
                        { type: "bot", text: "Here are some example queries:" },
                        ...data.queries.map((query) => ({
                            type: "bot",
                            // queryObject: { query_str: query }, // Store the query string in an object
                            queryObject: query,
                            text: query.query_str, // Display the query string directly
                            desc: query.desc
                        })),
                    ]);
                } else if (data.query_str) {
                    // Handle single MySQL query
                    setMessages([
                        ...newMessages,
                        {
                            type: "bot",
                            queryObject: data, // Store the entire MySQL query object
                            text: `${data.query_str}`, // Display the description and query
                            desc: `${data.desc}`
                        },
                    ]);
                }
            } else if (dbType.toLowerCase() === "mongodb") {
                if (Array.isArray(data)) {
                    // Handle multiple MongoDB queries
                    setMessages([
                        ...newMessages,
                        { type: "bot", text: "Here are some example queries:" },
                        ...data.map((query) => ({
                            type: "bot",
                            queryObject: query, // Store the full MongoDB query object
                            text: query.query_str, // Display the query string directly
                            desc: query.query_desc
                        })),
                    ]);
                } else if (data.query_str) {
                    // Handle single MongoDB query
                    setMessages([
                        ...newMessages,
                        {
                            type: "bot",
                            queryObject: data, // Store the entire MongoDB query object
                            text: data.query_str, // Display the query string
                            desc: data.query_desc
                        },
                    ]);
                }
            } else {
                // Handle unexpected response
                setMessages([
                    ...newMessages,
                    { type: "bot", text: "Sorry, I couldn't process your request." },
                ]);
            }
        } catch (error) {
            console.error("Error fetching response from the backend:", error);
            setMessages([
                ...newMessages,
                { type: "bot", text: "An error occurred. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };
    

    const runQuery = async (queryObject) => {
        try {
            setModalLoading(true); // Show loading spinner for the modal
            console.log(queryObject)
            const payload = {
                query: dbType.toLowerCase() === "mysql" ? queryObject.query_str : queryObject,
                dbName,
                dbType,
            };
    
            const response = await fetch("http://localhost:3001/api/run-query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            setQueryResult(
                dbType.toLowerCase() === "mongodb" ? data : data.result || []
            );
    
            setShowModal(true); // Show the modal with results
        } catch (error) {
            console.error("Error executing query:", error);
            setQueryResult([{ error: "An error occurred while executing the query." }]);
            setShowModal(true); // Show the modal with error message
        } finally {
            setModalLoading(false); // Hide loading spinner for the modal
        }
    };    
    
    

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <div className="chat-container">
                        <div className="chat-box">
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.type}`}>
                                {message.type === "bot" && message.queryObject ? (
                                    <>
                                        {message.desc && (
                                            <div className="bot-desc">
                                                <strong>Description:</strong>
                                                <p>{message.desc}</p>
                                            </div>
                                        )}
                                        {message.text && (
                                            <div className="bot-query">
                                                <strong>Query:</strong>
                                                <pre style={{ whiteSpace: "pre-wrap" }}>{message.text}</pre>
                                            </div>
                                        )}
                                        <button
                                            className="run-button ml-4"
                                            onClick={() => runQuery(message.queryObject)}
                                        >
                                            Run
                                        </button>
                                    </>
                                ) : (
                                    <div className="user-message">
                                        {message.text}
                                    </div>
                                )}
                            </div>     
                       
                            ))}
                            {loading && <div className="message bot">Loading...</div>}
                        </div>

                        <div className="input-wrapper mt-8">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask your question..."
                                className="chat-input pl-4"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                            />

                            <button onClick={sendMessage} className="send-button">
                                <i className="bi bi-arrow-up-circle text-2xl"></i>
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Modal for Query Results */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal-width">
                <Modal.Header closeButton>
                    <Modal.Title>Query Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalLoading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : queryResult ? (
                        dbType.toLowerCase() === "mongodb" ? (
                            <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(queryResult, null, 2)}
                            </pre>
                        ) : Array.isArray(queryResult) && queryResult.length > 0 ? (
                            <div style={{ overflowX: "auto" }}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            {Object.keys(queryResult[0]).map((key) => (
                                                <th key={key}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queryResult.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {Object.values(row).map((value, colIndex) => (
                                                    <td key={colIndex}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>No results to display.</p>
                        )
                    ) : (
                        <p>No results to display.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ChatComponent;