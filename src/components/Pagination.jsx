import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation();
    
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-center items-center gap-4 my-6">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
            >
                {t("coins.prev")}
            </button>
            <span className="text-gray-300">
                {t("coins.pageOf", { current: currentPage, total: totalPages })}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
            >
                {t("coins.next")}
            </button>
        </div>
    );
};

export default Pagination;
