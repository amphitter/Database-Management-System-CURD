"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  // Added duration field to the state
  const [newCourse, setNewCourse] = useState({ title: '', description: '', fees: '', duration: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
    
        const res = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    
    if (token) fetchCourses();
  }, [token]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/courses', newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses([...courses, res.data]);
      // Reset state including duration
      setNewCourse({ title: '', description: '', fees: '', duration: '' });
    } catch (error) {
      console.error(error);
      alert('Error adding course');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error(error);
      alert('Error deleting course');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl mb-4">Course Management</h1>
        <form onSubmit={handleAddCourse} className="mb-6 space-y-4">
          <div>
            <label>Course Title:</label>
            <input 
              type="text" 
              name="title" 
              value={newCourse.title} 
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
              className="border p-2 w-full" 
              required 
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea 
              name="description" 
              value={newCourse.description} 
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
              className="border p-2 w-full" 
              required
            ></textarea>
          </div>
          <div>
            <label>Fees:</label>
            <input 
              type="number" 
              name="fees" 
              value={newCourse.fees} 
              onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })} 
              className="border p-2 w-full" 
              required 
            />
          </div>
          <div>
            <label>Course Duration:</label>
            <input 
              type="text" 
              name="duration" 
              value={newCourse.duration} 
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} 
              className="border p-2 w-full" 
              required 
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Course
          </button>
        </form>
        <h2 className="text-2xl mb-4">Existing Courses</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Description</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Fees</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="text-center border-t">
                <td className="py-2">{course.title}</td>
                <td className="py-2">{course.description}</td>
                <td className="py-2">{course.duration}</td>
                <td className="py-2">{course.fees}</td>
                <td className="py-2">
                  <button 
                    onClick={() => handleDelete(course._id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
