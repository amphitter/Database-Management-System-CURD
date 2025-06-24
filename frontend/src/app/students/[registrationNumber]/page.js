"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { FiEdit, FiPrinter, FiArrowLeft, FiDollarSign, FiUser, FiBook, FiCalendar, FiPhone, FiMail, FiMapPin, FiTrash } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ConfirmationModal from "@/components/ConfirmationModal";

const PaymentHistory = ({ payments }) => (
  <div className="mt-8 px-8 pb-8">
    <h3 className="text-xl font-semibold mb-4">Payment History</h3>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments?.map((payment, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(payment.paymentDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">₹{payment.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(payment.fromDate).toLocaleDateString()} -{" "}
                {new Date(payment.toDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function StudentDetails() {
  const { registrationNumber } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/registration/${registrationNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data) {
          setStudent({
            ...res.data,
            dateOfBirth: format(parseISO(res.data.dateOfBirth), "dd MMM yyyy"),
            payments: res.data.payments?.map(payment => ({
              ...payment,
              paymentDate: new Date(payment.paymentDate),
              fromDate: new Date(payment.fromDate),
              toDate: new Date(payment.toDate)
            })) || []
          });
        } else {
          setError("Student not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (registrationNumber) fetchStudent();
  }, [registrationNumber, token, router]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${student._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push("/students");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete student");
    }
  };

  if (!token) return null;
  if (loading) return <LoadingSkeleton type="student-details" />;
  if (error) return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button onClick={() => router.back()} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
            <FiArrowLeft className="inline mr-2" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Students
        </button>

        {student && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {student.imageUrl ? (
                      <img
                        src={`http://localhost:5000/${student.imageUrl}`}
                        alt={student.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                        <FiUser className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{student.name}</h1>
                    <p className="opacity-90">{student.registrationNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.feesStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {student.feesStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 p-8">
              <div className="md:col-span-2 space-y-6">
                <DetailItem icon={<FiUser />} title="Father's Name">
                  {student.fatherName}
                </DetailItem>
                <DetailItem icon={<FiBook />} title="Course">
                  {student.courseTitle}
                </DetailItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={<FiCalendar />} title="Date of Birth">
                    {student.dateOfBirth}
                  </DetailItem>
                  <DetailItem icon={<FiDollarSign />} title="Fees">
                    ₹{student.fees ? student.fees.toLocaleString() : "N/A"}
                  </DetailItem>

                  <DetailItem icon={<FiPhone />} title="Contact">
                    {student.contact || "N/A"}
                  </DetailItem>
                  <DetailItem icon={<FiMail />} title="Email">
                    {student.email || "N/A"}
                  </DetailItem>
                </div>

                <DetailItem icon={<FiMapPin />} title="Address">
                  {student.address || "No address provided"}
                </DetailItem>

                <DetailItem title="Qualifications">
                  {student.qualification || "No qualifications listed"}
                </DetailItem>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Student Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/students/${student.registrationNumber}/edit`)}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit /> <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => router.push(`/students/${student.registrationNumber}/bill`)}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPrinter /> <span>Generate Bill</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      <FiTrash /> <span>Delete Student</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {student.payments?.length > 0 && <PaymentHistory payments={student.payments} />}
          </div>
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Student"
          message="Are you sure you want to delete this student record? This action cannot be undone."
        />
      </div>
    </div>
  );
}

const DetailItem = ({ icon, title, children }) => (
  <div className="border-b border-gray-100 pb-4">
    <div className="flex items-start space-x-3">
      {icon && <span className="text-gray-500 mt-1">{icon}</span>}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
        <p className="text-gray-800">{children}</p>
      </div>
    </div>
  </div>
);