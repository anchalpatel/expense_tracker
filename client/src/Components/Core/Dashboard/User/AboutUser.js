import React, { useEffect, useState } from 'react'
import DailyUserExpenseGraph from './DailyUserExpenseGraph'
import MonthlyExpenseGraph from './MonthlyExpenseGraph'
import RecentExpenses from './RecentExpenses'
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../../Common/Modal';
import { addMemberConfirmation } from '../../../../Services/operations/group';
import { setIsGrpReq } from '../../../../Reducer/Slices/authSlice';

function AboutUser() {
  const [openReqModal, setOpenReqModal] = useState(null);
  const {isGrpReq, token} = useSelector((state) => state.auth);
  //const {user} = useSelector((state) => state.profile);
  const {groupId} = useSelector((state) => state.group);
  // console.log("group Request", isGrpReq);
  // console.log("Id", groupId);
  const dispatch = useDispatch();
  const joinGroupWithConfirmation = async() => {
    try {
      const data = {
        groupId : groupId
      };
      const req = await addMemberConfirmation(data, token);
      //console.log("Request printing for add member with confirmation : ", req);
      setOpenReqModal(null);
      dispatch(setIsGrpReq(false));
    } catch (error) {
      //console.log("error occured while adding member with confirmation", error.message);
    }
  }
  useEffect(()=> {
    if(isGrpReq==true){
      setOpenReqModal(
        {
            title : "Do you want to join Group",
            description : "Are you sure you want to Join group?",
            button1Text : "Join",
            button1Handler : () => joinGroupWithConfirmation(),
            button2Text : "Cancel",
            button2Handler : () => setOpenReqModal(null)
        }
      );
    }
  }, [])
  
  return (
    <div className='flex flex-col gap-6 text-gray-400'>
      <div className='text-[22px] font-semibold text-white-100'>My Expenses</div>
      <div className='flex flex-col gap-3'>
        <p className='text-white ext-[14px] font-semibold'>Expense Statistics</p>
        <div className='flex gap-4 w-[100%] flex-col md:flex-row'>
          <div className='max-w-maxContent md:w-[100%] flex gap-3 flex-col px-3 py-3 mx-4 md:mx-0 bg-black-400 rounded-md border border-gray-300'>
            <p className='text-white'>Daily Expense</p>
            <DailyUserExpenseGraph></DailyUserExpenseGraph>
          </div>
          <div className='max-w-maxContent md:w-[100%] flex gap-3 flex-col px-3 py-3 mx-4 md:mx-0 bg-black-400 rounded-md border border-gray-300'>
            <p className='text-white'>Monthly Expense</p>
            <MonthlyExpenseGraph></MonthlyExpenseGraph>
          </div>
        </div>
      </div>
      <div >
        <p className='text-[22px] font-semibold text-white-100'>Recent expenses</p>
        <div>
          <RecentExpenses></RecentExpenses>
        </div>
      </div>
      <div>

      </div>
      {
        openReqModal && (<Modal modalData={openReqModal}></Modal>)
      }
    </div>
  )
}

export default AboutUser