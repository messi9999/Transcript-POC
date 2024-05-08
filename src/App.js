import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDashboard from './dashboard/MainDashboard';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<MainDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
