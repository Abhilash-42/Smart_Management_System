'use client';

export default function StatisticsCard({ title, value, icon, gradient, animation }) {
  const animations = {
    'fade-in': 'animate-fade-in',
    'slide-in': 'animate-slide-in',
    'zoom-in': 'animate-zoom-in'
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${animations[animation]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}