// components/EnhancedNotification.js
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function EnhancedNotification() {
  const [dueStudents, setDueStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const checkDueDates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students', { 
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const upcomingDue = res.data.filter(student => {
          if (!student.payments?.length) return true;
          const lastPayment = student.payments[student.payments.length - 1];
          const dueDate = new Date(lastPayment.toDate);
          const timeDiff = dueDate - Date.now();
          const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          return daysLeft <= 7 && daysLeft >= 0;
        });

        setDueStudents(upcomingDue);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (token) {
      checkDueDates();
      const interval = setInterval(checkDueDates, 300000);
      return () => clearInterval(interval);
    }
  }, [token]);

  if (!dueStudents.length) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-amber-800 font-semibold">
          ⚠️ {dueStudents.length} student(s) have fees due
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-amber-600 hover:text-amber-800"
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-3 space-y-2">
          {dueStudents.map(student => (
            <div key={student._id} className="flex justify-between items-center p-2 bg-amber-100 rounded">
              <div>
                <span className="font-medium">{student.name}</span>
                <span className="text-sm text-amber-600 ml-2">
                  {student.contact} • {student.courseTitle}
                </span>
              </div>
              <Link 
                href={`/students/${student.registrationNumber}`}
                className="text-amber-600 hover:text-amber-800 text-sm"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}