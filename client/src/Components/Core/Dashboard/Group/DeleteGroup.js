import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { deleteGroup } from "../../../../Services/operations/group"

export default function DeleteGroup() {
  const { group } = useSelector((state) => state.group);
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()

  async function handleDeleteAccount() {
    try {
      // console.log("Group Owner" ,group.groupOwner);
      // console.log("Group Owner" ,user._id);
      
      if (group.groupOwner === user._id) {
        dispatch(deleteGroup( id , user._id, user.token,navigate));
        navigate('/dashboard/group');
      } else {
        // Display an error message or prevent deletion if the user is not the owner
        toast.error("You are not the owner of this group.");
      }
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="w-[90%] md:w-[70%]">
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-12 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-2xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-white-100">
            Delete Account
          </h2>
          <div className="w-3/5 text-gray-400">
            <p>Would you like to delete group?</p>
            <p>
              This group contain expenses. Deleting your group is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={handleDeleteAccount}
          >
            I want to delete my group.
          </button>
        </div>

      </div>
    </div>
  )
}
