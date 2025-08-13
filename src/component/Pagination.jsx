import { Link } from 'react-router-dom';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onNext,
    onPrevious
}) => {
    const pageNumbers = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return (
        <div className="tablepagination">
            <div className="tbl-pagination-inr">
                <ul>
                    <li>
                        <Link to="#url" onClick={(e) => {
                            e.preventDefault();
                            onPrevious();
                        }}>
                            <img src="./images/arrow-left-black.svg" alt="Icon" />
                            Previous
                        </Link>
                    </li>

                    {pageNumbers.map((number, index) => (
                        <li key={index} className={currentPage === number ? 'active' : ''}>
                            {number === '...' ? (
                                <Link to="#url" onClick={(e) => e.preventDefault()}>...</Link>
                            ) : (
                                <Link to="#url" onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(number);
                                }}>
                                    {number}
                                </Link>
                            )}
                        </li>
                    ))}

                    <li>
                        <Link to="#url" onClick={(e) => {
                            e.preventDefault();
                            onNext();
                        }}>
                            Next
                            <img src="./images/arrow-right-black.svg" alt="Icon" />
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="pages-select">
                <form>
                    <div className="formfield">
                        <label>Page</label>
                        <select value={currentPage} onChange={(e) => onPageChange(Number(e.target.value))}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <option key={`page-${page}`} value={page}>
                                    {page}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                <p>of {totalPages}</p>
            </div>
        </div>
    );
};

export default Pagination;
