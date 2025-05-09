import styles from './Pagination.module.css'

interface PaginationProps {
    handlePrevPage: () => void;
    handleNextPage: () => void;
    page: number;
}

export default function Pagination({handlePrevPage, handleNextPage, page}: PaginationProps) {
    return (
        <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={page === 1}>
                Предыдущая
            </button>
            <span>Страница {page}</span>
            <button onClick={handleNextPage}>
                Следующая
            </button>
        </div>
    )
}