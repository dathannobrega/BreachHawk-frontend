"use client"

import { FaSearch } from "react-icons/fa"
import "../../styles/ui/search-input.css"

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-container">
      <input type="text" className="search-input" placeholder={placeholder} value={value} onChange={onChange} />
      <FaSearch className="search-icon" />
    </div>
  )
}

export default SearchInput
