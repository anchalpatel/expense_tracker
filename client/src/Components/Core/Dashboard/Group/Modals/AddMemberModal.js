import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdClose } from 'react-icons/md';
import AddMemberDynamicField from '../../../../Common/AddMemberDynamicField';
import GroupMemberCard from '../../../../Common/GroupMemberCard';
import { addMembers } from '../../../../../Services/operations/group';
import { useSelector } from 'react-redux';


function AddMemberModal({groupMembers, setAddMemberModal, groupName, id}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState : {errors}
  } = useForm();
  const {token} = useSelector((state) => state.auth);
  const [loading, setLoading] = useState();
  const [message, setMessge] = useState("");
  const membersEmails = groupMembers.map((memebr, index) => (
    memebr.email
  ))
  const addMember = async(member) => {
    try {
      const data = {
        groupMembers : member,
        link : `http://localhost:3000/signup/true/${id}`,
        groupId : id
      }
      const res = await addMembers(data, token);
      setMessge(res.membersRemaining);
    } catch (error) {
      console.error("Error occured while adding member into group", error.message);
    }
  }
  //console.log("Members", membersEmails)
  const onSubmitHandler = (data) => {
    for (let i = 0; i <data.groupMembers.length; i++) {
      const member = data.groupMembers[i];
      
      if (membersEmails.includes(member)) {

        data.groupMembers.splice(i, 1); // Remove the duplicate member
        i--;
      }
    }
    
    //console.log("GroupMembers", groupMembers);
    if(data.groupMembers.length==0){
      setMessge("You have not added any new member yet");
      return;
    }
    //console.log("Memeber in data : ", data.groupMembers)
    setLoading(true);
    //console.log("PRINTING GROUP MEMBER OBJECT : ", data.groupMembers)
    addMember(data.groupMembers);
    setLoading(false);
  }
  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
      <div className='bg-black-400 border w-[30rem] border-gray-500 rounded-xl'>
        <div className='flex justify-between items-center bg-gray-600 px-4 py-2 rounded-t-xl text-[16px] text-white'>
          <p>Add members</p>
          <MdClose onClick={()=>setAddMemberModal(false)}></MdClose>
        </div>
        <div className='flex flex-col gap-4 px-10 py-2 mt-4 mb-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-[18px] text-white font-semibold'>{groupName}</p>
            <div className='flex flex-col gap-4'>
              <p className='text-[16px] text-white'>GroupMembers</p>
             <div className='flex flex-col gap-3'>
              {
                  groupMembers.map((member, index) => (
                    <GroupMemberCard key={index} member={member}></GroupMemberCard>
                  ))
                }
             </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmitHandler)} className='w-[100%]'>
            <div className='text-white text-[16px]'>
            <AddMemberDynamicField
                              name="groupMembers"
                              label="Add members(Enter email id)"
                              register={register}
                              control={control}
                              setValue={setValue}
                              errors={errors}>
            </AddMemberDynamicField>
            </div>
            {
            !loading && message!==""  && (
              <p className='text-[14px] text-pink-200'>{message}</p>
            )
          }
            <button type='submit' className='px-4 py-1 bg-blue-400 text-[15px] text-white rounded-md self-center'>Submit</button>
          </form>
         
        </div>
      </div>
    </div>
  )
}

export default AddMemberModal