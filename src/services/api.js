import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentService = {
  getAllStudents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/students?${params}`);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/students/statistics');
    return response.data;
  },
};
export const courseService = {
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/courses?${params}`);
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  getEnrolledStudents: async (id) => {
    const response = await api.get(`/courses/${id}/students`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/courses/statistics');
    return response.data;
  },
};

export default api;