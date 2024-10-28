import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../Services/operations/settingsAPI"
import IconBtn from "../../../Common/IconBtn"



export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    //console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      //console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-gray-500 p-4 md:p-8 md:px-12">
          <h2 className="text-lg font-semibold text-white-100">
            Profile Information
          </h2>
          <div className="flex text-[14px] flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
            <label>
            <p className="mb-1 text-[o,8rem] leading-[1.375rem] text-white-100">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style w-full border border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
          </label>
            
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-pink-200">
                  Please enter your first name.
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
            <label>
            <p className="mb-1 text-[0.8rem] leading-[1.375rem] text-white-100">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter Last name"
                className="form-style w-full border border-gray-400 bg-black-400 text-white-100 py-2 rounded-lg px-2"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
          </label>
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-pink-200">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>
          <div className="">
            <label>
            <p className="mb-1 text-[0.8rem] leading-[1.375rem] text-white-100">
              Email <sup className="text-pink-200">*</sup>
            </p>
            <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="form-style w-full border border-gray-400 bg-black-400 text-white-100 py-2 text-[14px] rounded-lg px-2"
                {...register("email", { required: true })}
                defaultValue={user?.email}
              />
          </label>
              {errors.email && (
                <span className="-mt-1 text-[12px] text-pink-200">
                  Please enter your email.
                </span>
              )}
            </div>
        </div>

        <div className="flex justify-end gap-2 -mt-2">
          <button
            onClick={() => {
              navigate("/dashboard/aboutUser")
            }}
            className="cursor-pointer rounded-md bg-blue-400 py-2 px-5 text-[15px] font-semibold text-white-100"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  )
}
