import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, BookOpen, BarChart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import Reports from './pages/Reports'; 
function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Student System</h1>
          </div>
          <nav className="mt-8">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700">
              <Home size={20} />
              Dashboard
            </Link>
            <Link to="/students" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700">
              <Users size={20} />
              Students
            </Link>
            <Link to="/courses" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700">
              <BookOpen size={20} />
              Courses
            </Link>
            <Link to="/reports" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700">
              <BarChart size={20} />
              Reports
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/courses" element={<div className="p-6">Courses Page (Coming Soon)</div>} />
            <Route path="/reports" element={<div className="p-6">Reports Page (Coming Soon)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;