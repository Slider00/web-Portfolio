import React from "react";
import CoinRow from "./CoinRow";

const titles = ['#', 'Coin', 'Price', '24h Price Change', '24h Volume', '24h 📊'];

const TableCoins = ({ coins, search }) => {
    const filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-800 shadow-lg bg-gray-950">
            <table className="w-full min-w-[600px] text-left border-collapse">
                <thead className="bg-gray-900">
                <tr className="border-b border-gray-700">
                    {titles.map((title, i) => (
                        <th
                            key={i}
                            className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wide"
                        >
                            {title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                {filteredCoins.map((coin, index) => (
                    <CoinRow key={coin.id || index} coin={coin} index={index} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableCoins;
