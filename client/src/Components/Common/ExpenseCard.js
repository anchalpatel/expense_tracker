import React from 'react'
import { formatDate } from '../../Utils/DateFormatter'
import { NavLink, useNavigate } from 'react-router-dom'
import { setExpense } from '../../Reducer/Slices/expenseSlice'
import { useDispatch } from 'react-redux'

function ExpenseCard({expense}) {
    const date = formatDate(expense?.createdAt)
    const dispatch = useDispatch();
    //console.log("Expense in card", expense)
    const navigate = useNavigate();
    const clickHandler = () => {
        dispatch(setExpense(expense));
        //console.log("Inside onClick listener");
        navigate(`/dashboard/aboutExpense/${expense._id}`);
    }
  return (
    <div onClick={()=>clickHandler()} className='flex flex-col gap-2 px-7 pt-4 pb-5 border border-gray-400 rounded-md text-[14px]'>
        <div className='flex justify-between text-[17px] font-semibold text-white'>
            <p>{expense?.expenseName}</p>
            <p>{expense?.expensePerMember}₹</p>
        </div>
        <div className='text-white-100 text-[14px]'>
            <p> Group Name : <spin>{expense?.groupId?.groupName}</spin></p>
        </div>
        <div className='text-white-100 text-[14px]'>
            <p>  Date : <spin>{date}</spin></p>
        </div>
        <div className='text-white-100 text-[14px]'>
            <p>  About : <spin>{expense?.expenseDescription}</spin></p>
        </div>
        <div className='text-white-100 text-[14px] gap-2 flex justify-between'>
            <p>  Expense Currency : <spin>{expense?.expenseCurrency}</spin></p>
            <p>  Expense Type : <spin>{expense?.expenseType}</spin></p>
        </div>
    </div>
  )
}

export default ExpenseCard