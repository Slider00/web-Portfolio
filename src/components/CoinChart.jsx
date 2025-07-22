import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const MiniChart = ({ prices, color }) => {
    const data = {
        labels: prices.map((_, i) => i), // Solo índices (sin fechas)
        datasets: [
            {
                data: prices,
                borderColor: color || "rgba(0, 255, 0, 0.8)",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return (
        <div style={{ width: "120px", height: "40px" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default MiniChart;
