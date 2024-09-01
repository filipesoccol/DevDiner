"use client"

import React, { useRef, useEffect, useState } from 'react';

interface PieChartProps {
    data: number[];
    colors: string[];
    labels: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, colors, labels }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [radius, setRadius] = useState<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const total = data.reduce((acc, value) => acc + value, 0);
        let startAngle = 0;

        const drawChart = (currentRadius: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            startAngle = 0;
            data.forEach((value, index) => {
                const sliceAngle = (value / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.moveTo(80, 80); // Center of the pie chart
                ctx.arc(80, 80, currentRadius, startAngle, startAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = colors[index];
                ctx.fill();
                startAngle += sliceAngle;
            });
        };

        const animate = () => {
            setRadius((prevRadius) => {
                const newRadius = prevRadius + 1;
                if (newRadius <= 75) {
                    drawChart(newRadius);
                    requestAnimationFrame(animate);
                }
                return newRadius;
            });
        };

        animate();
    }, [data, colors]);

    return (
        <div className='flex gap-4'>
            <canvas ref={canvasRef} width={160} height={160} />
            <div className="flex flex-col mt-2.5">
                {labels.map((label, index) => (
                    <div key={index} className="flex items-center mb-1.25">
                        <div className="w-3 h-3 mr-2" style={{ backgroundColor: colors[index] }}></div>
                        <span className='text-xs'>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;