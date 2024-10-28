import { toast } from "react-hot-toast"
import { setUser } from "../../Reducer/Slices/profileSlice"
import { setLoading, setToken } from "../../Reducer/Slices/authSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../api"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
    VIEW_USER_API
  } = endpoints

  export function sendOtp(email, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SENDOTP_API, {
          email,
          checkUserPresent: true,
        })
        console.log("SENDOTP API RESPONSE............", response)
  
        //console.log(response.data.success)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
  
        toast.success("OTP Sent Successfully")
        navigate("/emailVerification")
      } catch (error) {
        console.log("SENDOTP API ERROR............", error)
        if(error.message === "Request failed with status code 401"){
          toast.error("Use Is already Registered Please login")
        }
        else{
          toast.error("SignUp failed Please Try later")
        }
      
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  export function signUp(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SIGNUP_API, {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        })
  
        console.log("SIGNUP API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Signup Successful")
        navigate("/login")
      } catch (error) {
        console.log("SIGNUP API ERROR............", error)
        toast.error("Signup Failed")
        navigate("/signup")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  export function login(email, password, navigate) {
    return async (dispatch) => {
      //const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        })
  
        console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
  
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))
        const userImage = response.data?.user?.image
          ? response.data?.user?.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
        dispatch(setUser({ ...response.data.user, image: userImage }))
        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        localStorage.setItem("expenseToken", JSON.stringify(response.data.token))
        localStorage.setItem("expenseUser", JSON.stringify(response.data.user))
        localStorage.setItem("expiresAt", expiresAt)
        dispatch(setLoading(false));
        navigate("/dashboard/aboutUser")
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        if(error.message === "Request failed with status code 401"){
          toast.error("Please Sign Up first")
        } else if(error.message === "Request failed with status code 400"){
          toast.error("Verify your email or password")
        } else {
          toast.error("Login Failure Please Try Again")
        }
      }
      dispatch(setLoading(false))
      //toast.dismiss(toastId)
    }
  }   
  export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.removeItem("expenseToken")
      localStorage.removeItem("expenseUser")
      toast.success("Logged Out")
      navigate("/")
    }
  }
  export function getPasswordResetToken(email , setEmailSent) {
    return async(dispatch) => {
      dispatch(setLoading(true));
      try{
        const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})
  
        console.log("RESET PASSWORD TOKEN RESPONSE....", response);
  
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Reset Email Sent");
        setEmailSent(true);
      }
      catch(error) {
        console.log("RESET PASSWORD TOKEN Error", error);
        toast.error("Failed to send email for resetting password");
      }
      dispatch(setLoading(false));
    }
  }
  export function resetPassword(password, confirmPassword, token) {
    return async(dispatch) => {
      dispatch(setLoading(true));
      try{
        const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
  
        console.log("RESET Password RESPONSE ... ", response);
  
  
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Password has been reset successfully");
      }
      catch(error) {
        console.log("RESET PASSWORD TOKEN Error", error);
        toast.error("Unable to reset password");
      }
      dispatch(setLoading(false));
    }
  }
  export const viewUser = async(data) => {
    let result = null;
    
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", VIEW_USER_API, data)
        console.log("View User api response...............", response);
        if(!response?.data?.success){
            toast.dismiss(toastId);
            toast.error(response?.data?.message)
            throw new Error("Could not fetch user data"); 
        }
        result = response?.data
    } catch (error) {
        toast.dismiss(toastId);
        console.log("VIEW USER API ERROR...", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result
  }
