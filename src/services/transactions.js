import axios from 'axios';

const baseUrl = `https://criptoya.com/api/satoshitango`


export const getCryptoPrice = async (cryptoCode) => {
    const request =  axios.get(`${baseUrl}/${cryptoCode}/ars/1`)
    return await request.then(response => response.data.totalBid)

}


/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {getCryptoPrice}