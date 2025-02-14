import React from 'react'

const Search = ({ searchterm, setSearchTerm }) => {
    return (
        <div className="search">
            <div>
            <img src="search.svg" alt="search"/>

                <input
                type="text"
                placeholder="Search..."
                value={searchterm}
                onChange={(e)=> setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}
export default Search
