import { useState } from "react";

const HodScreenSearch = ({ onSearch, placeholder = "Search anything here...", value = "" }) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="formfield">
        {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8047 14.8633L11.2547 10.3133C12.1359 9.22188 12.6666 7.8375 12.6666 6.33333C12.6666 2.8425 9.82414 0 6.33331 0C2.84248 0 0 2.8425 0 6.33333C0 9.82417 2.84248 12.6667 6.33331 12.6667C7.83748 12.6667 9.22185 12.136 10.3133 11.2548L14.8633 15.8048C15.0241 15.9656 15.2433 16 15.3847 16C15.526 16 15.7452 15.9656 15.906 15.8048C16.2275 15.4833 16.2275 14.9667 15.8047 14.8633ZM6.33331 11.3333C3.57598 11.3333 1.33331 9.09067 1.33331 6.33333C1.33331 3.576 3.57598 1.33333 6.33331 1.33333C9.09064 1.33333 11.3333 3.576 11.3333 6.33333C11.3333 9.09067 9.09064 11.3333 6.33331 11.3333Z" fill="#356598"/>
            </svg> */}
      <input
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      
      {/* <input type="submit" /> */}
    </div>
  );
};

export default HodScreenSearch;




// import { useState } from "react";

// const HodScreenSearch = ({ 
//   onSearch, 
//   placeholder = "Search anything here...",
//   value = "", // Add value prop to control from parent
//   onClear,    // Add clear handler
//   isLoading   // Add loading state
// }) => {
//   const [localValue, setLocalValue] = useState(value);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setLocalValue(value);
//     onSearch(value);
//   };

//   const handleClear = () => {
//     setLocalValue("");
//     onSearch(""); // Clear search
//     if (onClear) onClear(); // Optional: notify parent
//   };

//   return (
//     <div className="formfield search-container">
//       <input
//         placeholder={placeholder}
//         type="text"
//         value={localValue || value} // Use either local or parent-controlled value
//         onChange={handleSearchChange}
//         disabled={isLoading}
//       />
//       {isLoading && (
//         <span className="search-loading">
//           {/* Add your loading spinner here */}
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="#356598" xmlns="http://www.w3.org/2000/svg">
//             <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-2A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" opacity="0.2"/>
//             <path d="M8 0a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6V0z">
//               <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/>
//             </path>
//           </svg>
//         </span>
//       )}
//       {(localValue || value) && !isLoading && (
//         <button 
//           type="button" 
//           className="clear-search" 
//           onClick={handleClear}
//           aria-label="Clear search"
//         >
//           &times;
//         </button>
//       )}
//     </div>
//   );
// };

// export default HodScreenSearch;