import axios from 'axios';

let baseURL = "http://localhost:3003/"

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null


export const api = axios.create({
    baseURL : baseURL,
    headers: {
        Authorization : token ? "Token " + token : null,
        "Content-Type":"application/json",
        accept:"application/json",
    },
})