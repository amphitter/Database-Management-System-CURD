//frontend/src/app/pending-fees/page.js
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';

export default function PendingFees() {
  const [students, setStudents] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingStudents = res.data.filter(student => student.feesStatus === 'Unpaid');
        setStudents(pendingStudents);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchPendingStudents();
  }, [token]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl mb-4">Students with Pending Fees</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Registration Number</th>
              <th className="py-2">Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id} className="text-center border-t">
                <td className="py-2">{student.name}</td>
                <td className="py-2">{student.registrationNumber}</td>
                <td className="py-2">{student.courseTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}