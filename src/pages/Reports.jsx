import { useState, useEffect } from 'react';
import { Download, Users, BookOpen, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { studentService, courseService } from '../services/api';

function Reports() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes, statsRes, courseStatsRes] = await Promise.all([
        studentService.getAllStudents(),
        courseService.getAllCourses(),
        studentService.getStatistics(),
        courseService.getStatistics(),
      ]);

      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setStats(statsRes.data);
      setCourseStats(courseStatsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = [...new Set(students.map(s => s.department))];

  const filteredStudents = selectedDepartment === 'all'
    ? students
    : students.filter(s => s.department === selectedDepartment);

  const departmentStats = departments.map(dept => ({
    department: dept,
    studentCount: students.filter(s => s.department === dept).length,
    courseCount: courses.filter(c => c.department === dept).length,
  }));

  const statusDistribution = {
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    graduated: students.filter(s => s.status === 'graduated').length,
  };

  const yearDistribution = {
    1: students.filter(s => s.year_of_study === 1).length,
    2: students.filter(s => s.year_of_study === 2).length,
    3: students.filter(s => s.year_of_study === 3).length,
    4: students.filter(s => s.year_of_study === 4).length,
  };

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Department', 'Program', 'Year', 'Status'];
    const rows = filteredStudents.map(s => [
      s.student_id,
      `${s.first_name} ${s.last_name}`,
      s.email,
      s.department,
      s.program,
      s.year_of_study,
      s.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          <Download size={20} />
          Export to CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold mt-1">{stats?.total_students || 0}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold mt-1">{courseStats?.total_courses || 0}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Departments</p>
              <p className="text-2xl font-bold mt-1">{stats?.total_departments || 0}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Students</p>
              <p className="text-2xl font-bold mt-1">{stats?.active_students || 0}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics from Stats API */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <p className="text-blue-800 text-sm font-medium">Avg Year of Study</p>
              <p className="text-3xl font-bold text-blue-900">
                {parseFloat(stats?.avg_year_of_study || 0).toFixed(1)}
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Average academic progress across all students
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <p className="text-purple-800 text-sm font-medium">Total Enrollments</p>
              <p className="text-3xl font-bold text-purple-900">
                {courseStats?.total_enrollments || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-purple-700 mt-2">
            Total course registrations system-wide
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-orange-800 text-sm font-medium">Avg Course Credits</p>
              <p className="text-3xl font-bold text-orange-900">
                {parseFloat(courseStats?.avg_credits || 0).toFixed(1)}
              </p>
            </div>
          </div>
          <p className="text-sm text-orange-700 mt-2">
            Average credit hours per course offered
          </p>
        </div>
      </div>

      {/* Enrollment Rate Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Active Enrollment Rate</h3>
            <p className="text-sm text-gray-600">
              Percentage of students currently active in the system
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600">
              {stats?.total_students > 0 
                ? ((stats.active_students / stats.total_students) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.active_students || 0} of {stats?.total_students || 0} students
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats?.total_students > 0 
                  ? ((stats.active_students / stats.total_students) * 100)
                  : 0}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Department
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Students by Department</h2>
          <div className="space-y-3">
            {departmentStats.map(({ department, studentCount }) => (
              <div key={department}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{department}</span>
                  <span className="text-sm text-gray-500">{studentCount} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${students.length > 0 ? (studentCount / students.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Student Status Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Active</span>
              <span className="text-2xl font-bold text-green-600">{statusDistribution.active}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-800">Inactive</span>
              <span className="text-2xl font-bold text-yellow-600">{statusDistribution.inactive}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Graduated</span>
              <span className="text-2xl font-bold text-blue-600">{statusDistribution.graduated}</span>
            </div>
          </div>
        </div>

        {/* Year Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Students by Year of Study</h2>
          <div className="space-y-3">
            {Object.entries(yearDistribution).map(([year, count]) => (
              <div key={year}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Year {year}</span>
                  <span className="text-sm text-gray-500">{count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${students.length > 0 ? (count / students.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses by Department */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Courses by Department</h2>
          <div className="space-y-3">
            {departmentStats.map(({ department, courseCount }) => (
              <div key={department} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{department}</span>
                <span className="text-lg font-bold text-purple-600">{courseCount} courses</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Student List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Detailed Student List</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.student_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.program}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Year {student.year_of_study}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : student.status === 'graduated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;