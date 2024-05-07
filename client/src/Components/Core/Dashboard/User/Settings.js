import ChangeProfilePicture from "../Settings/ChangeProfilePicture"
import DeleteAccount from "../Settings/DeleteAccount"
import EditProfile from "../Settings/EditProfile"
import UpdatePassword from "../Settings/UpdatePassword"

export default function Settings() {
  return (
    <>
      <h1 className="mb-14 text-3xl font-bold text-white-100">
        Edit Profile
      </h1>
      {/* Change Profile Picture */}
      <ChangeProfilePicture />
      {/* Profile */}
      <EditProfile />
      {/* Password */}
      <UpdatePassword />
      {/* Delete Account */}
      <DeleteAccount />
    </>
  )
}
