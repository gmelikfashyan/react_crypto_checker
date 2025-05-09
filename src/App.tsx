import { useState } from 'react'
import './App.css'
import CryptoChecker from "./components/cryptoChecker/CryptoChecker.tsx";
import {useCryptoApi} from "./hooks/useCryptoApi.ts";
import type {SelectOptions} from "./types/crypto.ts";
import Pagination from "./components/pagination/Pagination.tsx";
import CryptoChat from "./components/cryptoChat/CryptoChat.tsx";


function App() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SelectOptions>("market_cap_desc");
  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleSort = (sort: SelectOptions) => {
      setSort(sort);
      setPage(1);
  }
  const {data, isLoading, isError, error} = useCryptoApi(page, sort);


    return (
        <>
            {isError && (
                <div className="error">
                    Ошибка загрузки данных: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
                </div>
            )}

            <CryptoChecker data={data || []} isLoading={isLoading} onSort={handleSort}/>
            <Pagination
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
            />
            <CryptoChat/>

        </>
    );
}


export default App
