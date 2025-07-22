import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import Footer from "../sections/Footer";
import "../index.css";
import axios from "axios";
import TableCoins from "../components/TableCoins";
import Pagination from "../components/Pagination";
import Navbar from "../sections/Navbar.jsx";

function CoinsPage() {
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [allCoins, setAllCoins] = useState(0); // Total monedas
    const [loading, setLoading] = useState(false);
    const perPage = 100;

    const getTotalCoins = async () => {
        try {
            const res = await axios.get("https://api.coingecko.com/api/v3/coins/list");
            setAllCoins(res.data.length);
        } catch (error) {
            console.error("Error fetching total coins:", error);
        }
    };

    const getData = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: perPage,
                    page: pageNumber,
                    sparkline: true,
                },
            });
            setCoins(res.data);
        } catch (error) {
            console.error("Error fetching market data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getTotalCoins();
    }, []);

    useEffect(() => {
        getData(page);
    }, [page]);

    // Filtrar monedas según búsqueda
    const filteredCoins = useMemo(() => {
        return coins.filter((coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    }, [coins, search]);

    // Calcular total de páginas según filtro (si hay filtro, solo 1 página)
    const totalPages = search
        ? 1
        : Math.ceil(allCoins / perPage);

    return (
        <div>
            <Navbar />
            <div>
                <input
                    type="text"
                    placeholder="Search by coins 🔎"
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset a la página 1 cuando buscas
                    }}
                    className="w-full max-w-md mx-auto my-8 px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-md"
                />
                {loading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : (
                    <TableCoins coins={filteredCoins} search={search} />
                )}
                {/* Mostrar paginación solo si hay más de 1 página */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
                {/* Si solo hay una página, mostrar mensaje opcional */}
                {totalPages === 1 && !loading && (
                    <p className="text-center text-gray-400 my-4">
                        Page 1 of 1
                    </p>
                )}
            </div>
            <Footer />
        </div>
    );
}

createRoot(document.getElementById("root")).render(<CoinsPage />);
