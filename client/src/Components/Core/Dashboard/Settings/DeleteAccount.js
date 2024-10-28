import {RiDeleteBinLine} from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../Services/operations/settingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      //console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <div className="my-10 flex flex-col gap-x-6 w-[100%] rounded-md border-[1px] border-pink-700 bg-pink-900 p-4 md:p-8 md:px-12">
        <div className="flex gap-4">
          <div className='flex justify-center items-center h-[40px] aspect-square rounded-full bg-pink-700 border border-pink-200'>
                        <RiDeleteBinLine className='text-pink-200'></RiDeleteBinLine>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-white-100">
                Delete Account
            </h2>
          </div>
        </div>
        <div className="text-gray-400 mt-3 flex flex-col gap-4">
              <p>Would you like to delete account?</p>
              <p>
                This account may contain Paid Courses. Deleting your account is
                permanent and will remove all the contain associated with it.
              </p>
        </div>
        <button
              type="button"
              className="w-fit cursor-pointer italic mt-2 text-pink-300"
              onClick={handleDeleteAccount}
            >
              I want to delete my account.
        </button>
      </div>
    </>
  )
}
