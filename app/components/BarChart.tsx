"use client"

import React from 'react';
import { PieColors } from '@/app/interfaces';

interface BarChartProps {
    data: number[];
    total: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, total }) => {
    const hasNonZeroValue = data.some(value => value > 0);

    if (!hasNonZeroValue) {
        return <div className="text-center text-gray-500">No sufficient data available to show chart.</div>;
    }

    const maxValue = Math.max(...data);

    return (
        <div className="w-80 h-64 flex items-end justify-between space-x-2 animate-in zoom-in fade-in">
            {data.map((value, index) => {
                const percentage = ((value / total) * 100).toFixed(1);
                const height = `${Math.max((value / maxValue) * 100, 1)}%`;

                return (
                    <div key={index} className="flex flex-col items-center justify-end h-full">
                        <div className="text-xs mb-1">{percentage}%</div>
                        <div
                            className="w-8 rounded-t-md transition-all duration-300 ease-in-out"
                            style={{
                                height: height,
                                backgroundColor: PieColors[index],
                                minHeight: '4px',
                            }}
                        ></div>
                    </div>
                );
            })}
        </div>
    );
};

export default BarChart;