import React from "react";
import MiniChart from "./CoinChart";

const CoinRow = ({ coin, index }) => {
    const priceChange = coin.price_change_percentage_24h;

    return (
        <tr className="border-b border-gray-700">
            <td className="px-4 py-3 text-xs sm:text-sm text-white whitespace-nowrap">
                {index + 1}
            </td>

            <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-white">{coin.name}</span>
                <span className="ml-2 text-xs sm:text-sm text-gray-400 uppercase">
          ({coin.symbol})
        </span>
            </td>

            <td className="px-4 py-3 text-xs sm:text-sm text-white whitespace-nowrap">
                ${coin.current_price.toLocaleString()}
            </td>

            <td
                className={`px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
            >
                {priceChange?.toFixed(2)}%
            </td>

            <td className="px-4 py-3 text-xs sm:text-sm text-white whitespace-nowrap">
                ${coin.total_volume.toLocaleString()}
            </td>

            <td className="px-4 py-3 text-xs sm:text-sm text-white whitespace-nowrap">
                {coin.sparkline_in_7d ? (
                    <MiniChart
                        prices={coin.sparkline_in_7d.price}
                        color={priceChange >= 0 ? "rgba(0,255,0,0.7)" : "rgba(255,0,0,0.7)"}
                    />
                ) : (
                    <span className="text-gray-400 text-xs">No Data</span>
                )}
            </td>
        </tr>
    );
};

export default CoinRow;
