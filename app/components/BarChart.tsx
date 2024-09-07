"use client"

import React from 'react';
import { PieColors } from '@/app/interfaces';

interface BarChartProps {
    data: number[];
    total: number;
    width?: number;
    height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, total, width = 350, height = 350 }) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const barWidth = chartWidth / data.length;

    const maxValue = Math.max(...data);
    const yScale = (value: number) => (value / maxValue) * chartHeight;

    const bars = data.map((value, index) => {
        const barHeight = yScale(value);
        const x = margin.left + index * barWidth;
        const y = height - margin.bottom - barHeight;
        const percentage = ((value / total) * 100).toFixed(1);

        return (
            <g key={index}>
                <rect
                    x={x}
                    y={y}
                    width={barWidth - 2}
                    height={barHeight}
                    fill={PieColors[index]}
                />
                <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="black"
                >
                    {percentage}%
                </text>
            </g>
        );
    });

    return (
        <svg width={width} height={height}>
            {bars}
            {/* X-axis */}
            <line
                x1={margin.left}
                y1={height - margin.bottom}
                x2={width - margin.right}
                y2={height - margin.bottom}
                stroke="black"
            />
            {/* Y-axis */}
            <line
                x1={margin.left}
                y1={margin.top}
                x2={margin.left}
                y2={height - margin.bottom}
                stroke="black"
            />
        </svg>
    );
};

export default BarChart;