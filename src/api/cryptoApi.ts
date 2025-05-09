import type {CryptoCoin, SelectOptions} from "../types/crypto.ts";
import axios from "axios";

export async function fetchCryptoApi(page: number, sort: SelectOptions): Promise<CryptoCoin[]> {
    try {
        const {data} = await axios.get<CryptoCoin[]>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sort}&per_page=10&page=${page}`,
            {
                headers: {
                    accept: "application/json",
                    "x-cg-demo-api-key": "CG-PjHuwnZzxVhffeC81EDtELGK",
                },
            },
        );
        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Could not fetch CryptoApi: Could not fetch CryptoApi");
    }
}