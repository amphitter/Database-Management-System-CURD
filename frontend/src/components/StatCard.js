export default function StatCard({ title, value, trend, trendLabel, color = 'blue' }) {
  // Base color settings
  const baseColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
    green: { bg: 'bg-green-50', text: 'text-green-700' },
  };

  // Determine trend styling: positive (green), negative (red), or neutral (gray)
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend > 0 ? '▲' : trend < 0 ? '▼' : '—';
  const formattedTrend = trend > 0 ? `+${Math.abs(trend)}` : trend < 0 ? `-${Math.abs(trend)}` : `${Math.abs(trend)}`;

  return (
    <div className={`${baseColors[color].bg} p-5 rounded-xl transition-shadow hover:shadow-md`}>
      <div className="space-y-2">
        <h3 className={`text-sm font-medium ${baseColors[color].text}`}>{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${trendColor}`} aria-label={`${trendLabel} ${trend}`}>
            {trendLabel}: {trendIcon} {formattedTrend}
          </span>
        </div>
      </div>
    </div>
  );
}
