// frontend/src/app/students/page.js
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import StudentDetails from '@/components/StudentDetails';
import Link from "next/link";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState({ course: '', feesStatus: '' });
  const [search, setSearch] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchStudents();
  }, [token]);

  const filteredStudents = students.filter(student => {
    return (
      (filter.course === '' || student.courseTitle === filter.course) &&
      (filter.feesStatus === '' || student.feesStatus === filter.feesStatus) &&
      (search === '' ||
        (student.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (student.registrationNumber?.toLowerCase() || '').includes(search.toLowerCase()))
    );
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl mb-4">Students</h1>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by name or registration number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 flex-grow"
          />
          <select
            onChange={(e) => setFilter({ ...filter, course: e.target.value })}
            className="border p-2"
          >
            <option value="">All Courses</option>
            {[...new Set(students.map(student => student.courseTitle))].map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, feesStatus: e.target.value })}
            className="border p-2"
          >
            <option value="">All Fee Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {selectedStudent ? (
          <StudentDetails student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Registration Number</th>
                <th className="py-2">Course</th>
                <th className="py-2">Fee Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} className="text-center border-t cursor-pointer hover:bg-gray-100">
                  <td className="py-2">{student.name}</td>
                  <td className="py-2">{student.registrationNumber}</td>
                  <td className="py-2">{student.courseTitle}</td>
                  <td className="py-2">{student.feesStatus}</td>
                  <td className="py-2">
                    <Link href={`/students/${student.registrationNumber}`} className="text-blue-500 hover:text-blue-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}
