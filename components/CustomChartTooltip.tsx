import React from 'react';

const CustomChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
        <p className="label text-sm text-white font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.fill }}>
            <span className="text-xs">{`${pld.name}: `}</span>
            <span className="font-semibold">{`${pld.value} sec`}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomChartTooltip;