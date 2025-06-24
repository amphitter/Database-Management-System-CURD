"use client";
import Link from "next/link";
import { FixedSizeList as List } from "react-window";

export default function StudentList({ students }) {
  // Define a row renderer for react-window
  const Row = ({ index, style }) => {
    const student = students[index];
    return (
      <div style={style}>
        <Link
          key={student._id}
          href={`/students/${student.registrationNumber}`}
          className="block p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{student.name}</h4>
              <p className="text-sm text-gray-600">{student.courseTitle}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 text-sm rounded-full ${
                  student.feesStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student.feesStatus}
              </span>
              <p className="text-sm text-gray-600 mt-1">{student.contact}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: "400px" }}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Student Directory</h3>
      </div>
      <List
        className="custom-scrollbar"
        height={400}
        itemCount={students.length}
        itemSize={80}
        width="100%"
        overscanCount={5}
      >
        {Row}
      </List>
      <style jsx global>{`
        /* WebKit-based browsers */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #007bff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0056b3;
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #007bff #f1f1f1;
        }
      `}</style>
    </div>
  );
}
