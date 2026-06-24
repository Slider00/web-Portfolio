import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import Footer from "../sections/Footer";
import "../index.css";
import "../i18n"; // Import i18n initialization
import axios from "axios";
import TableCoins from "../components/TableCoins";
import Pagination from "../components/Pagination";

// Barra de búsqueda con botón de volver
function SearchBar({ onSearch }) {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");

    // Evitar que se llame onSearch en cada tecla (debounce)
    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(inputValue);
        }, 400); // Espera 400ms antes de disparar

        return () => clearTimeout(timeout);
    }, [inputValue, onSearch]);

    return (
        <div
            className="flex items-center w-full max-w-md mx-auto my-8 gap-3"
            style={{ marginTop: "4rem" }}
        >
            <button
                onClick={() =>
                    (window.location.href = `${import.meta.env.BASE_URL}`)
                }
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
                aria-label={t("coins.backTooltip")}
            >
                👈
            </button>


            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("coins.searchPlaceholder")}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-md"
            />
        </div>
    );
}

function CoinsPage() {
    const { t } = useTranslation();
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalCoins, setTotalCoins] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const perPage = 100;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener total solo una vez, con caché en localStorage para optimizar rendimiento de red
            if (page === 1 && totalCoins === 0) {
                let cachedTotal = null;
                try {
                    const cachedVal = localStorage.getItem("coingecko_total_coins");
                    const cachedTime = localStorage.getItem("coingecko_total_coins_time");
                    if (cachedVal && cachedTime) {
                        const age = Date.now() - parseInt(cachedTime, 10);
                        if (age < 24 * 60 * 60 * 1000) { // 24 horas
                            cachedTotal = parseInt(cachedVal, 10);
                        }
                    }
                } catch (e) {
                    console.warn("Storage access failed:", e);
                }

                if (cachedTotal) {
                    setTotalCoins(cachedTotal);
                } else {
                    try {
                        const listRes = await axios.get("https://api.coingecko.com/api/v3/coins/list");
                        const count = listRes.data.length;
                        setTotalCoins(count);
                        try {
                            localStorage.setItem("coingecko_total_coins", count.toString());
                            localStorage.setItem("coingecko_total_coins_time", Date.now().toString());
                        } catch (e) {
                            console.warn("Writing to storage failed:", e);
                        }
                    } catch (apiErr) {
                        console.error("Failed to fetch list length:", apiErr);
                        // Fallback a un número estimado razonable si falla la API
                        setTotalCoins(5000);
                    }
                }
            }

            // Obtener datos de mercado
            const marketRes = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: perPage,
                    page,
                    sparkline: true,
                },
            });

            setCoins(marketRes.data);
        } catch (err) {
            console.error("Error fetching coins:", err);
            if (err.response && err.response.status === 429) {
                setError("Too many requests. CoinGecko API is rate-limited. Please wait a minute and try again.");
            } else {
                setError("Failed to load coins. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }, [page, totalCoins]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredCoins = useMemo(() => {
        const term = search.toLowerCase();
        return coins.filter(
            (coin) => coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term)
        );
    }, [coins, search]);

    const totalPages = search ? 1 : Math.ceil(totalCoins / perPage);

    return (
        <div>
            <SearchBar
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            {loading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}

            {!loading && !error && <TableCoins coins={filteredCoins} />}

            {!loading && !error && totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}

            {!loading && !error && totalPages === 1 && (
                <p className="text-center text-gray-400 my-4">
                    {t("coins.pageOf", { current: 1, total: 1 })}
                </p>
            )}

            <Footer />
        </div>
    );
}

createRoot(document.getElementById("root")).render(<CoinsPage />);
