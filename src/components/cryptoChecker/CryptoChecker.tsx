import type {SelectOptions, CryptoCoin} from "../../types/crypto.ts";
import styles from './CryptoChecker.module.css'

interface CryptoProps {
    data: CryptoCoin[];
    isLoading: boolean;
    onSort: (value: SelectOptions) => void;
}

export default function CryptoChecker({data, isLoading, onSort}: CryptoProps) {



    return (
        <div className={styles.container}>
            <h1>Криптовалютный рынок</h1>

            {isLoading && <div className="loading">Загрузка данных...</div>}


            {data && (
                <div className={styles.tableWrapper}>
                    <table className={styles.cryptoTable}>
                        <thead>
                        <tr>
                            <th>Ранг</th>
                            <th>Монета</th>
                            <th>Цена (USD)</th>
                            <th>Изменение за 24ч</th>
                            <th>Капитализация <button className={styles.buttonSort} onClick={() => onSort('market_cap_desc')}>▼</button> <button className={styles.buttonSort} onClick={() => onSort('market_cap_asc')}>▲</button></th>
                            <th>Объем торгов за 24 часа <button className={styles.buttonSort} onClick={() => onSort('volume_desc')}>▼</button> <button className={styles.buttonSort} onClick={() => onSort('volume_asc')}>▲</button></th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(coin => (
                            <tr key={coin.id}>
                                <td>{coin.market_cap_rank}</td>
                                <td>
                                    <div className={styles.coinInfo}>
                                        <img src={coin.image} alt={coin.name} width="20" height="20" />
                                        <span>{coin.name}</span>
                                        <span className={styles.token}>{coin.symbol?.toUpperCase()}</span>
                                    </div>
                                </td>
                                <td>${coin.current_price?.toLocaleString()}</td>
                                <td className={
                                    coin.price_change_percentage_24h > 0 ? styles.positive :
                                        coin.price_change_percentage_24h < 0 ? styles.negative : ''
                                }>
                                    {coin.price_change_percentage_24h != null ?
                                        `${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                                </td>
                                <td>${coin.market_cap?.toLocaleString()}</td>
                                <td>${coin.total_volume}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}