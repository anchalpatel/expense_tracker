import React, { useEffect, useState } from 'react'
import { MdGroupAdd } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { viewUserGroup } from '../../../../Services/operations/group';
import GroupCard from '../../../Common/GroupCard';
import { NavLink } from 'react-router-dom';
import CreateGroupModal from './Modals/CreateGroupModal';
function Group() {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const {token} = useSelector((state) => state.auth);
  //const {} = useSelector((state)=>state.group);
  const dispatch = useDispatch();
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [openModal,  setOpenModal] = useState(false);
  const getUserGroups = async() => {
    try {
      const res = await viewUserGroup(token);
      //console.log("User groups : ", res);
      setGroups(res.data);
    } catch (error) {
      console.error("Error occured while fetching groups : ", error);
    }
  }
  useEffect(()=>{
    setLoading(true);
    getUserGroups();
    setLoading(false);
  }, [openModal]);
  if(loading){
    return <div className='loader'></div>
  }
  
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-[22px] font-semibold text-white-100'>
        Groups
      </p>
      <div className='flex justify-end'>
        <button 
                onClick={()=>(setOpenModal(true))}
                className='text-white flex gap-2 px-4 py-2 text-[14px] mr-3 md:mr-0 bg-blue-400 hover:bg-black-400 hover:border hover:border-gray-400 hover:scale-90 transition-all duration-700 justify-center items-center rounded-md'>
          
          <MdGroupAdd className='text-[18px]' />
          Create Group
        </button>
      </div>
      {
          groups.length==0 && (<div className='flex justify-center items-center'>
            <p className='text-[16px] text-white'>No group yet</p>
          </div>)
        
      }
      {groups.length>0 && <div className='flex flex-col gap-7 mt-4'>
        {
          groups.map((group, index) => (
            <div key={index} onClick={(event) => { 
              event.preventDefault(); 
              ;
            }}>
            <NavLink to={`/dashboard/aboutGroup/:${group._id}`}>
              <GroupCard group={group}></GroupCard>
            </NavLink>
          </div>
          ))
        }
      </div>}
      {
        openModal && (
          <CreateGroupModal setOpenModal={setOpenModal}></CreateGroupModal>
        )
      }
    </div>
  )
}

export default Group