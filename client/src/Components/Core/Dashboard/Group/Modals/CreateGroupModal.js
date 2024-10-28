import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { MdClose } from "react-icons/md";
import Upload from '../../../../Common/Upload';
import { useSelector } from 'react-redux';
import { createGroup } from '../../../../../Services/operations/group';
import { toast } from 'react-toastify';
import AddMemberDynamicField from '../../../../Common/AddMemberDynamicField';
function CreateGroupModal({setOpenModal}) {
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.profile);
    const userEmail = user.user.email
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState : {errors}
    } = useForm();
    const defaultValue = [{email : userEmail}]
    const submitHandler = async (data) => {
        const toastId = toast.loading('Loading...', { autoClose: false }); 
        //toast.loading("Loading....");
    
        const formData = new FormData();
        formData.append("groupName", data.groupName);
        formData.append("groupDescription", data.groupDescription);
        formData.append("groupImage", data.groupImage);
        let groupMembersEmails = "";
        data.groupMembers.map((member) => {
            groupMembersEmails += member.email;
            groupMembersEmails += ","
        });
        groupMembersEmails = groupMembersEmails.slice(0, -1)
        //console.log("GROUP MEMBERAS EMAILS----------->", groupMembersEmails)
        formData.append("groupMembers", groupMembersEmails)
        formData.append("groupCurrency", "INR")
        formData.append("groupType", "Group");    
        setLoading(true);
        
        const result = await createGroup(formData,token);
        //console.log("Printing result : ", result);
        if(result) {
            //console.log("Group : ", result);
            toast.error("Error occurred while creating group");
      }
        setOpenModal(false);
        setLoading(false);
        toast.dismiss(toastId);
        // console.log("PRINTING FORMDATA", formData);
        // console.log("PRINTING result", result);
    }
  return (
    <div className='fixed  inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        <div className='bg-black-400 border border-gray-500 rounded-xl'>
            <div className='flex justify-between items-center bg-gray-600 px-4 py-2 rounded-t-xl text-[16px] text-white'>
                <p>Create Group</p>
                <MdClose onClick={()=>(setOpenModal(false))}/>
            </div>
            <div className='text-[14px] text-gray-400 px-6 py-5'>
                <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='groupName'>Group Name <sup className='text-pink-200'>*</sup></label>
                        <input
                                id='groupName'
                                {...register("groupName", {required:true})}
                                placeholder='House Management Group'
                                className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'></input>
                        {
                            errors.groupName && (
                                <span className='text-pink-200'>Group Name is require**</span>
                            )
                        }        
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='groupDescription'>Group Description <sup className='text-pink-200'>*</sup></label>
                        <textarea
                                id='groupDescription'
                                {...register("groupDescription", {required:true})}
                                placeholder='Write your discription here'
                                className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'></textarea>
                        {
                            errors.groupDescription && (
                                <span>Group Descripton is require**</span>
                            )
                        }        
                    </div>
                    <Upload
                            name="groupImage"
                            label="Group Image"
                            register={register}
                            setValue={setValue}
                            getValues={getValues}
                            video={false}
                            viewData={null}
                            editData={null}
                            groupImage=""></Upload>
                   <AddMemberDynamicField
                             name="groupMembers"
                             label="Add members(Enter email id)"
                             register={register}
                             control={control}
                             defaultValue = {defaultValue}
                             setValue={setValue}
                             errors={errors}></AddMemberDynamicField>
                    <button type='submit' className='bg-blue-400 text-white-100 px-3 py-2 rounded-md self-center hover:bg-black-400 hover:border hover:shadow-md hover:border-gray-400 hover:scale-90 transition-all duration-500'>Create</button>

                </form>
            </div>
        </div>
    </div>
  )
}

export default CreateGroupModal
// className='bg-gray-500  text-[14px] px-3 py-2 rounded-md'