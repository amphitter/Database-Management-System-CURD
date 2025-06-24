"use client";

import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PieController,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PieController,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement
);

export default function EnhancedChart({ students = [], courses = [] }) {
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("monthly");
  const [paymentData, setPaymentData] = useState({});

  useEffect(() => {
    const processPaymentData = students.reduce((acc, student) => {
      student.payments?.forEach((p) => {
        if (!p.paymentDate || isNaN(new Date(p.paymentDate).getTime())) {
          console.warn("Invalid payment date:", p.paymentDate);
          return;
        }
        const month = new Date(p.paymentDate).toLocaleString("default", { month: "short" });
        acc[month] = (acc[month] || 0) + p.amount;
      });
      return acc;
    }, {});

    console.log("Processed Payment Data:", processPaymentData);
    setPaymentData(processPaymentData);
  }, [students]);

  const courseData = courses.reduce((acc, course) => {
    acc[course.title] = students.filter((s) => s.courseTitle === course.title).length;
    return acc;
  }, {});

  const feeData = {
    Paid: students.filter((s) => s.feesStatus === "Paid").length,
    Pending: students.filter((s) => s.feesStatus === "Unpaid").length,
  };

  const chartConfigs = {
    bar: {
      data: {
        labels: Object.keys(courseData),
        datasets: [
          {
            label: "Students per Course",
            data: Object.values(courseData),
            backgroundColor: "#3b82f6",
            borderRadius: 8,
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Course Enrollment" } },
        responsive: true,
        maintainAspectRatio: false,
      },
    },
    line: {
      data: {
        labels: Object.keys(paymentData),
        datasets: [
          {
            label: "Payments",
            data: Object.values(paymentData),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderWidth: 2,
            pointBackgroundColor: "#10b981",
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Payment Trends" } },
        responsive: true,
        maintainAspectRatio: false,
      },
    },
    pie: {
      data: {
        labels: Object.keys(feeData),
        datasets: [
          {
            data: Object.values(feeData),
            backgroundColor: ["#10b981", "#ef4444"],
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Fee Status" } },
        responsive: true,
        maintainAspectRatio: false,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <ChartFilter chartType={chartType} setChartType={setChartType} timeRange={timeRange} setTimeRange={setTimeRange} showTimeFilter={chartType !== 'pie'} />
      <div className="h-96">
        {chartType === "bar" && <Bar data={chartConfigs.bar.data} options={chartConfigs.bar.options} />}
        {chartType === "line" && Object.keys(paymentData).length > 0 ? (
          <Line data={chartConfigs.line.data} options={chartConfigs.line.options} />
        ) : (
          chartType === "line" && <p className="text-center text-gray-500">No payment data available.</p>
        )}
        {chartType === "pie" && <Pie data={chartConfigs.pie.data} options={chartConfigs.pie.options} />}
      </div>
    </div>
  );
}

export function ChartFilter({ chartType, setChartType, timeRange, setTimeRange, showTimeFilter }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
      >
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="pie">Pie Chart</option>
      </select>

      {showTimeFilter && (
        <select
          className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      )}
    </div>
  );
}
