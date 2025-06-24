"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EnhancedChart from "@/components/EnhancedChart";
import EnhancedNotification from "@/components/EnhancedNotification";
import DataFilter from "@/components/DataFilter";
import StudentList from "@/components/StudentList";
import { ExportButton } from "@/components/ExportButton";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import StatCard from "@/components/StatCard";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    courses: [],
    students: [],
    filteredStudents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const students = studentsRes.data;
      const courses = coursesRes.data;

      setStats({
        total: students.length,
        pending: students.filter((s) => s.feesStatus === "Unpaid").length,
        paid: students.filter((s) => s.feesStatus === "Paid").length,
        courses,
        students,
        filteredStudents: students,
      });
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Calculate new students as those admitted in the last 30 days
  const newStudents = stats.students.filter((student) => {
    if (!student.admissionDate) return false;
    const admissionDate = new Date(student.admissionDate);
    const today = new Date();
    const diffDays = (today - admissionDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  const handleFilter = (filters) => {
    const filtered = stats.students.filter((student) => {
      return (
        (!filters.course || student.courseTitle === filters.course) &&
        (!filters.feeStatus || student.feesStatus === filters.feeStatus) &&
        (!filters.dateRange || new Date(student.admissionDate) >= new Date(filters.dateRange))
      );
    });
    setStats((prev) => ({ ...prev, filteredStudents: filtered }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <EnhancedNotification />

        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Dashboard Overview</h1>
            <ExportButton data={stats.filteredStudents} fileName="dashboard-export" className="sm:ml-4" />
          </header>

          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

          {loading ? (
            <LoadingSkeleton type="dashboard" />
          ) : (
            <>
              <DataFilter onFilter={handleFilter} />

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="grid md:grid-cols-3 gap-4">
                    <StatCard
                      title="Total Students"
                      value={stats.total}
                      trend={newStudents}
                      trendLabel="New Students"
                      color="blue"
                    />
                    <StatCard
                      title="Pending Fees"
                      value={stats.pending}
                      trend={stats.pending}
                      trendLabel="Require Action"
                      color="orange"
                    />
                    <StatCard
                      title="Paid Fees"
                      value={stats.paid}
                      trend={stats.paid}
                      trendLabel="This Month"
                      color="green"
                    />
                  </div>

                  <StudentList students={stats.filteredStudents} />
                </div>

                {/* Right Column */}
                <EnhancedChart students={stats.students} courses={stats.courses} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
