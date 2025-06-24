"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DataFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    course: "",
    feeStatus: "",
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <select
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
          className="p-2 border rounded-lg"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course.title}>
              {course.title}
            </option>
          ))}
        </select>

        <select
          name="feeStatus"
          value={filters.feeStatus}
          onChange={handleFilterChange}
          className="p-2 border rounded-lg"
        >
          <option value="">All Fee Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
}
