import React from 'react'
import CoinRow from './CoinRow'

const titles = ['#', 'Coin', 'Price', 'Price Change', '24h Volume', 'Graph']

const TableCoins = ({coins}) => {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full min-w-[600px] text-left border-collapse">
                <thead className="bg-transparent">
                <tr className="border-b border-gray-700">
                    {titles.map((title, i) => (
                        <th
                            key={i}
                            className="px-4 py-3 text-xs sm:text-sm font-bold text-white uppercase tracking-wide whitespace-nowrap">
                            {title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                {coins.map((coin, index) => (
                    <CoinRow key={coin.id || index} coin={coin} index={index}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableCoins;
