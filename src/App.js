import logo from './logo.svg';
import './App.css';
import NavBar from './components/Navbar';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DatabaseList from './components/DatabaseList';
import DatabaseDetails from "./components/DatabaseDetails";  // Import the new component
import LearningPage from "./components/LearningPage";
import UploadDataSet from "./components/UploadDataSet";

function App() {

  return (
    <div>
      <Router>
      <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/databases/:dbType" element={<DatabaseList />} />
          <Route path="/database/:dbType/:dbName" element={<DatabaseDetails />} />
          <Route path="/learn/:dbType/:dbName" element={<LearningPage />} />
          <Route path="/upload" element={<UploadDataSet />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
