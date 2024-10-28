import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateGroup } from "../../../../Services/operations/group";
import IconBtn from "../../../Common/IconBtn";
import DeleteGroup from "./DeleteGroup";
import ViewGroupMember from "./ViewGroupMember";
import UpdateGroupImage from "./UpdateGroupImage";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdateGroup() {

  const { group } = useSelector((state) => state.group);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();
  
  //console.log("group data", group)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitGroupForm = async (data) => { 
    //console.log("Update Data", data)
    if(data.groupName==group.groupName && data.groupDescription==group.groupDescription){
      toast.error("You have entered the same data")
    }
    else{
      try {
        //console.log(id)
        dispatch(updateGroup(token,data,id)); 
        
      } catch (error) {
        console.log('ERROR MESSAGE - ', error.message);
  
      }
    }
    
  };

  return (
    <div className="flex flex-col items-center">
    {/* group Image */}
      <UpdateGroupImage/>
    {/* Update Group */}
      <form onSubmit={handleSubmit(submitGroupForm)} className="w-[90%] md:w-[70%] self-center">
        {/* Group Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-gray-500 p-8 px-12">
          <h2 className="text-lg font-semibold text-white-100">Basic Details</h2>
       
            <div className="flex flex-col gap-2">
              <label className="flex flex-col gap-2">
                <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
                  Group Name
                </p>
                <input
                  type="text"
                  name="groupName"
                  id="groupName"
                  placeholder={group?.groupName}
                  className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] text-gray-100 w-[100%] border-gray-500 px-3 py-2 rounded-md'
                  {...register("groupName")}
                  defaultValue={group?.groupName}
                />
              </label>
              {errors.groupName && (
                <span className="-mt-1 text-[12px] text-white-100">Please enter group name.</span>
              )}
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="flex flex-col gap-2">
                <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
                  Group Description
                </p>
                <textarea
                  id='groupDescription'
                  {...register("groupDescription")}
                  placeholder={group?.groupDescription}
                  className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] text-gray-100 w-[100%] border-gray-500 px-3 py-2 rounded-md'
                  defaultValue={group?.groupDescription}
                />

              </label>
              {errors.groupDescription && (
                <span className="-mt-1 text-[12px] text-white-100">Please enter group description.</span>
              )}
            </div>
        
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/group");
            }}
            className="cursor-pointer rounded-md bg-blue-400 py-2 px-5 font-semibold text-white-100"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      
      </form>
      
      {/* Viewing additional info */}
      <ViewGroupMember/>
      {/* Delete The Group */}
      <DeleteGroup/>

    </div>
  );
}
