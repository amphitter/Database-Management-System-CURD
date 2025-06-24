"use client";
import { utils, writeFile } from "xlsx";

export function ExportButton({ data, fileName }) {
  const handleExport = () => {
    console.log("Export Data:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error("No valid data available for export.");
      alert("No valid data available for export.");
      return;
    }

    try {
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`);
      alert("Excel file has been successfully downloaded!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting data. Check console for details.");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Export to Excel
    </button>
  );
}
