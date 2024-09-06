"use client"

import React from 'react';

interface PieChartProps {
    data: number[];
    colors: string[];
    labels: string[];
    width?: number;
    height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, colors, labels, width = 400, height = 400 }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const radius = Math.min(width, height) / 2;
    const center = { x: width / 2, y: height / 2 };

    let startAngle = 0;
    const slices = data.map((value, index) => {
        const angle = (value / total) * 360;
        const endAngle = startAngle + angle;

        const start = polarToCartesian(center, radius, startAngle);
        const end = polarToCartesian(center, radius, endAngle);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const d = [
            "M", center.x, center.y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
            "Z"
        ].join(" ");

        startAngle = endAngle;

        return <path key={index} d={d} fill={colors[index]} />;
    });

    return (
        <svg width={width} height={height}>
            {slices}
        </svg>
    );
};

function polarToCartesian(center: { x: number, y: number }, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: center.x + (radius * Math.cos(angleInRadians)),
        y: center.y + (radius * Math.sin(angleInRadians))
    };
}

export default PieChart;