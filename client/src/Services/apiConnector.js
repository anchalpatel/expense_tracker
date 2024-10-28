import axios from "axios";

export const axiosInstance = axios.create({});
export const apiConnector = (method, url, bodyData, headers, params) => {
    // console.log("Sending data to backend:", bodyData);
    // console.log("Sending url to backend:", `${url}`);
    return axiosInstance({
        method : `${method}`,
        url : `${url}`,
        data : bodyData ? bodyData : null,
        headers : headers,
        params : params ? params : null
    })
}