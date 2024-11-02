import { ContractAnalysis } from '@/interfaces/contract.interface';
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true
})

export const logout = async ()=>{
    const response = await api.get("/auth/logout");
    return response.data;
}

export async function fetchUserContract():Promise<ContractAnalysis[]>{
    const response = await api.get('/contracts/user-contracts')
    return response.data
}