// components/ChartFilter.js
export default function ChartFilter({ chartType, setChartType, timeRange, setTimeRange, showTimeFilter }) {
    return (
      <div className="flex flex-wrap gap-4">
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