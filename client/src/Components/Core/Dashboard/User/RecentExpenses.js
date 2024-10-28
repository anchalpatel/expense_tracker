import React, { useEffect, useState } from 'react'
import { viewUserExpense } from '../../../../Services/operations/expense';
import { useSelector } from 'react-redux';
import ExpenseCard from '../../../Common/ExpenseCard';


function RecentExpenses() {
    const [expense, setEpenses] = useState([]);
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const getRecentExpenses = async() => {
       try {
        const res = await viewUserExpense(token);
        // console.log("Recent expense : ", res);
        setEpenses(res?.data?.expenseData);
       } catch (error) {
        //console.log("Error occured while fetching user recent expenses");
       }
    }
    useEffect(()=>{
        setLoading(true);
        getRecentExpenses();
        setLoading(false);
    }, [])
    if(loading){
        return(
            <div className='flex justify-center items-center h-[calc(70vh-2rem)]'></div>
        )
    }
  return (
    <div>
        {
            !loading && expense.length>0 && (
                <div className='flex flex-col gap-4 mt-4'>
                {
                    expense.map((expense, index) => (
                        <ExpenseCard key={index} expense={expense}></ExpenseCard>
                    ))
                }
            </div>
            )
        }
        
        {
            !loading && expense.length==0 && (
                <div>
                    <p>You have not created any expense yet</p>
                </div>
            )
        }
    </div>
  )
}

export default RecentExpenses