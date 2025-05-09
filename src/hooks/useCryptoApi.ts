import {useQuery} from "@tanstack/react-query";
import {fetchCryptoApi} from "../api/cryptoApi.ts";
import type {CryptoCoin, SelectOptions} from "../types/crypto.ts";

export function useCryptoApi(page: number, sort: SelectOptions) {
    return useQuery<CryptoCoin[]>({
        queryKey: ['crypto', page, sort],
        queryFn: () => fetchCryptoApi(page, sort),
    });
}