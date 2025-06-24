"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "@/components/Sidebar";

export default function GenerateBill() {
  const { registrationNumber } = useParams();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Student details and payment form state
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentDate, setPaymentDate] = useState("");
  const [monthOfPayment, setMonthOfPayment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [modeDetails, setModeDetails] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // PDF preview data URL
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (registrationNumber) {
      const fetchStudent = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/students/registration/${registrationNumber}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStudent(res.data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch student data.");
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [registrationNumber, token, router]);

  // Generate PDF in landscape with two copies side by side
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const halfWidth = pageWidth / 2;

    // Try loading logo
    let logoDataUrl = null;
    try {
      const resp = await fetch("/logo.png");
      if (resp.ok) {
        const blob = await resp.blob();
        const reader = new FileReader();
        logoDataUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (err) {
      console.log("Logo not available, using fallback text");
    }

    // Helper function to draw a copy (Office/Student)
    const drawCopy = (label, offsetX) => {
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "PNG", offsetX + 20, 20, 60, 40);
        doc.setFontSize(14);
        doc.text("Fees Slip", offsetX + 90, 35);
        doc.setFontSize(10);
        doc.text(`${label} Copy`, offsetX + 90, 50);
      } else {
        doc.setFontSize(14);
        doc.text(
          "Center For Information Technology And Network",
          offsetX + halfWidth / 2,
          35,
          { align: "center" }
        );
        doc.text("Fees Slip", offsetX + halfWidth / 2, 55, { align: "center" });
        doc.setFontSize(10);
        doc.text(`${label} Copy`, offsetX + halfWidth / 2, 70, { align: "center" });
      }

      // Build table data
      const tableBody = [];
      tableBody.push(["Student Name", student?.name || ""]);
      tableBody.push(["Father's Name", student?.fatherName || ""]);
      tableBody.push(["Registration No.", student?.registrationNumber || ""]);
      tableBody.push(["Course Enrolled", student?.courseTitle || ""]);
      tableBody.push(["Payment Date", paymentDate]);
      tableBody.push(["Month of Payment", monthOfPayment]);
      tableBody.push(["Payment From-To", `${fromDate} - ${toDate}`]);
      tableBody.push(["Payment Method", paymentMethod]);
      if (paymentMethod.toLowerCase() === "cashless") {
        tableBody.push(["Mode Details", modeDetails]);
        tableBody.push(["Transaction ID", transactionId]);
      }
      tableBody.push(["Amount Paid", `Rs ${amount}`]);

      // Create table using autoTable
      autoTable(doc, {
        startY: 80,
        startX: offsetX + 20,
        margin: { left: offsetX + 20 },
        tableWidth: halfWidth - 40,
        head: [["Field", "Value"]],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [230, 230, 230] },
      });

      // Add signature line at the bottom
      doc.setFontSize(10);
      doc.text(
        "Authorized Signature: _______________________",
        offsetX + 20,
        pageHeight - 40
      );
    };

    // Draw vertical divider
    doc.setLineWidth(0.5);
    doc.line(halfWidth, 0, halfWidth, pageHeight);

    // Draw the two copies
    drawCopy("Office", 0);
    drawCopy("Student", halfWidth);

    // Output the PDF as a data URL for preview
    const url = doc.output("bloburl");
    setPdfDataUrl(url);
  };

  const validateDates = () => {
    const today = new Date();
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return from <= to && to >= today;
  };

  // Handle form submission to generate PDF

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) {
      alert("Student data not loaded yet.");
      return;
    }
    
    if (!validateDates()) {
      alert("Invalid date range. To Date must be in the future.");
      return;
    }

    try {
      // Save payment record
      await axios.post(
        `http://localhost:5000/api/students/${registrationNumber}/payments`,
        {
          amount,
          paymentDate: new Date().toISOString(),
          fromDate: new Date(fromDate).toISOString(),
          toDate: new Date(toDate).toISOString(),
          month: monthOfPayment,
          method: paymentMethod,
          modeDetails,
          transactionId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await generatePDF();
      setNotification({ message: "Payment recorded successfully!", visible: true });
      setTimeout(() => setNotification({ message: "", visible: false }), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ message: "Payment failed. Please try again.", visible: true });
      setTimeout(() => setNotification({ message: "", visible: false }), 3000);
    }
  };

  // Print the PDF from an embedded iframe
  const handlePrint = () => {
    const iframe = document.getElementById("pdfIframe");
    if (!iframe) return;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
  const [notification, setNotification] = useState({ message: "", visible: false });

  
  // Conditional rendering inside the component
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Generate Fees Slip</h1>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
          <div>
            <label className="block font-semibold">Payment Date:</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Payment For Month:</label>
            <input
              type="text"
              placeholder="e.g., March 2025"
              className="border rounded p-2 w-full"
              value={monthOfPayment}
              onChange={(e) => setMonthOfPayment(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block font-semibold">From Date:</label>
              <input
                type="date"
                className="border rounded p-2 w-full"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">To Date:</label>
              <input
                type="date"
                className="border rounded p-2 w-full"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold">Payment Method:</label>
            <select
              className="border rounded p-2 w-full"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Cashless">Cashless</option>
            </select>
          </div>
          {paymentMethod.toLowerCase() === "cashless" && (
            <>
              <div>
                <label className="block font-semibold">Mode (UPI/Card/Netbanking):</label>
                <input
                  type="text"
                  className="border rounded p-2 w-full"
                  value={modeDetails}
                  onChange={(e) => setModeDetails(e.target.value)}
                  placeholder="e.g., UPI, Netbanking..."
                />
              </div>
              <div>
                <label className="block font-semibold">Transaction ID:</label>
                <input
                  type="text"
                  className="border rounded p-2 w-full"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID if applicable"
                />
              </div>
            </>
          )}
          <div>
            <label className="block font-semibold">Amount Paid (₹):</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate PDF
          </button>
        </form>

        {/* PDF Preview and Print */}
        {pdfDataUrl && (
          <div className="mt-4">
            <iframe
              id="pdfIframe"
              src={pdfDataUrl}
              style={{ width: "100%", height: "600px" }}
            />
            <button
              onClick={handlePrint}
              className="bg-green-600 px-4 py-2 rounded text-white p-2 mt-2"
            >
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
