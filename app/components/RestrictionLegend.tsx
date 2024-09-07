import React from 'react';
import { PieColors, RestrictionLabels } from '../interfaces';

interface RestrictionLegendProps {
    data: number[];
    total: number;
}

const RestrictionLegend: React.FC<RestrictionLegendProps> = ({ data, total }) => {
    // Check if there's at least one entry in the data > 0
    const hasData = data.some(value => value > 0);

    if (!hasData) {
        return null; // Don't render anything if there's no data
    }

    return (
        <div className="mt-4 text-sm animate-in slide-in-from-top-20 fade-in delay-75">
            <h5 className="font-semibold mb-2">Legend:</h5>
            <ul className="grid grid-cols-2 gap-2">
                {RestrictionLabels.map((label, index) => (
                    <li key={index} className="flex items-center">
                        <span
                            className="inline-block w-4 h-4 mr-2"
                            style={{ backgroundColor: PieColors[index] }}
                        ></span>
                        {label}: {((data[index] * 100) / total).toFixed(1)}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestrictionLegend;