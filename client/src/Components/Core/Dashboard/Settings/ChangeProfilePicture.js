import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { updateDisplayPicture } from "../../../../Services/operations/settingsAPI";
import IconBtn from "../../../Common/IconBtn";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  //console.log("Printing user : ", user)

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      //console.log("ERROR MESSAGE - ", error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <>
<div className="flex items-center justify-center rounded-md p-8 px-12 text-white-100 relative">
  <div className="relative flex items-center gap-x-4 flex-col">
    <div className="aspect-square w-max rounded-full z-20 overflow-hidden">
     
          <img
          src={previewSource || user?.profileImage}
          alt={`profile-${user?.firstName}`}
          className="w-[6rem] aspect-square object-cover rounded-full border border-gray-200 z-0"
        />
        <div className=" flex items-center justify-center ">
          <label htmlFor="fileInput">
            <div className="absolute bottom-16 right-3 rounded-full bg-gray-400 p-1 shadow-md cursor-pointer">  <FiEdit2 className="text-white text-lg" />
            </div>
          </label>
        </div>
      <input
        id="fileInput"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/gif, image/jpeg"
      />
    
   
    </div>
    <div className="space-y-2 mt-6">
      <div className="flex flex-row gap-3">
        <IconBtn
          text={loading ? "Uploading..." : "Upload"}
          onclick={handleFileUpload}
        >
          {!loading && <FiUpload className="text-lg text-richblack-900" />}
        </IconBtn>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
