import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { sendOtp } from "../../../Services/operations/authAPI"
import { setIsGrpReq, setSignupData } from "../../../Reducer/Slices/authSlice"
import { setGroupId } from "../../../Reducer/Slices/groupSlice"


function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isGrpReq = useParams('isGrpReq');
  //console.log("isGrpReq123",isGrpReq.isGrpReq);
  if(isGrpReq.isGrpReq!=null){
    dispatch(setIsGrpReq(true));
  }
  const groupId = useParams('groupId');
  //console.log("isGrpReq",groupId);
  if(isGrpReq.groupId!=null){
    dispatch(setGroupId(isGrpReq.groupId));
  }
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    const signupData = {
      ...formData,
    }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
   
  }

  return (
    <div>
   
      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4 mt-6">
          <label>
            <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
              First Name <sup className="text-white-100">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="form-style w-full border text-[14px] border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
            />
          </label>
          <label>
            <p className="mb-1 text-[1rem] leading-[1.375rem] text-white">
              Last Name <sup className="text-white">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="form-style w-full border text-[14px] border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[1rem] leading-[1.375rem] text-white">
            Email Address <sup className="text-white">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="form-style w-[90%] border text-[14px] border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
          />
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[1rem] leading-[1.375rem] text-white">
              Create Password <sup className="text-white">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style w-full border text-[14px] border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-[16px] text-gray-400"/>
              ) : (
                <AiOutlineEye className="text-[16px] text-gray-400"/>
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[1rem] leading-[1.375rem] text-white">
              Confirm Password <sup className="text-white">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="form-style w-full border text-[14px] border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible className="text-[16px] text-gray-400"/>
              ) : (
                <AiOutlineEye className="text-[16px] text-gray-400"/>
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-blue-400 py-[8px] px-[12px] font-bold text-white-100 hover:bg-black-400 hover:border-[1px] hover:border-gray-400 transition-all duration-500"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm
