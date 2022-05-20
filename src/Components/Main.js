import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import BookItems from "./Book/BookItems";
import "../css/style.css";

export default function Main() {

    const [category, setCategory] = React.useState(null);
    const [filters, setFilters] = React.useState({ authors: [], publishers: [] });
    const [years, setYears] = React.useState({ minYear: 0, maxYear: 9999 });

    const reset = () => {
        setCategory(null);
        setFilters({ authors: [], publishers: [] });
        setYears({ minYear: 0, maxYear: 9999 });
    }

    return (
        <div>
            <Sidebar setCategory={setCategory} setFilters={setFilters} setYears={setYears} category={category} filters={filters} years={years} />
            <div className="toolbar-container">
                <button type="button" className="btn btn-primary btn-custom" data-bs-toggle="collapse" data-bs-target="#sidebar" role="button" aria-expanded="false" aria-controls="sidebar"><i className="fa-solid fa-arrow-left"></i></button>
                <button type="button" onClick={() => { reset(); }} className="btn btn-primary btn-custom"><i className="fa-solid fa-rotate"></i></button>
                <div className="search-container">
                    <input type="text" className="search-control" placeholder="Αναζήτηση..." />
                    <button type="button" className="btn btn-primary btn-custom btn-search"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </div>
            <div className="content">
                <BookItems category={category} filters={filters} years={years} />
            </div>
        </div>
    );
}