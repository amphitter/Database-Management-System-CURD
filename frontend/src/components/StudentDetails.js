"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");  // Correctly fetch ID
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    console.log("Student ID:", studentId);
    console.log("Token:", token);
    
    if (!studentId || !token) return;  
  
    const fetchStudent = async () => {
      try {
        console.log("Fetching student details...");
        const res = await axios.get(`http://localhost:5000/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Student Data:", res.data);
        setStudent(res.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudent();
  }, [studentId, token]);
  

  const handleEdit = () => {
    router.push(`/edit?id=${studentId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="flex flex-col md:flex-row p-6 bg-white shadow-lg rounded-lg">
      {/* Left Section - Details */}
      <div className="md:w-2/3 p-4">
        <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
        <p><strong>Registration Number:</strong> {student.registrationNumber}</p>
        <p><strong>Course:</strong> {student.courseTitle}</p>
        <p><strong>Fees Status:</strong> {student.feesStatus}</p>
        <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
        <p><strong>Email:</strong> {student.email || "N/A"}</p>
        <p><strong>Address:</strong> {student.address || "N/A"}</p>
        <div className="mt-4 flex gap-4">
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
          <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded">Print Bill</button>
          <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">Go Back</button>
        </div>
      </div>
      
      {/* Right Section - Image */}
      <div className="md:w-1/3 flex justify-center items-center p-4">
        {student.imageUrl ? (
          <img src={student.imageUrl} alt="Student Image" className="w-48 h-48 object-cover rounded shadow" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center border border-gray-300 bg-gray-100 rounded">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
