import toast from "react-hot-toast";

export function checkTokenValidity(){
    console.log("Callllllllleeeeddd")
    const token = localStorage.getItem("expenseToken");
    const expiresAt = localStorage.getItem("expiresAt");
    if(!token || Date.now() > expiresAt){
        localStorage.removeItem("expenseToken");
        localStorage.removeItem("expenseUser");
        localStorage.removeItem("expiresAt");
        toast.error("Your session has expired. Please Login again")
        return false;
    }
    return true;
}