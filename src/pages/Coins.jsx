import React from "react";
import {useEffect, useState} from "react"
import { createRoot } from "react-dom/client";
import Footer from "../sections/Footer";
import "../index.css";
import axios from "axios";
import TableCoins from "../components/TableCoins";

function CoinsPage() {

    const [coins, setCoins] = useState([]);

    const getData = async () => {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1")
        console.log(res.data)
        setCoins(res.data)
    }

    useEffect(() => {
        getData()
    }, []);
    return (
        <div className="">
            <div className="">
                <TableCoins coins={coins} getData={getData} />
            </div>
            <Footer />
        </div>

    );
}

createRoot(document.getElementById("root")).render(<CoinsPage />);
