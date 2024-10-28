import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { formatDate } from '../../../../Utils/DateFormatter';
import { useForm } from 'react-hook-form';
import AddMemberDynamicField from '../../../Common/AddMemberDynamicField';
import toast from 'react-hot-toast';
import { updateExpense } from '../../../../Services/operations/expense';

function AboutExpene() {
  const {
    setValue,
    formState: {errors},
    handleSubmit,
    getValues,
    control,
    register
  } = useForm();
  const {expense} = useSelector((state) => state.expense);
  //
  //console.log("Expense in about expense : ", expense)
  const date = formatDate(expense.createdAt)
  const {token} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile)
  const defaultValues = expense.expenseMembers.map((member)=>({"email" : member.email}));
  
  const expenseOwener = expense.expenseMembers.filter((member)=>(member._id==expense.expenseOwner));
  //console.log("Expnese owner : ", expenseOwener)

  const isFormUpdated = (newData) => {
    const formData = expense;
    //console.log("Printing form data", formData)
    let isMembersUpdated = false;
    //console.log("New in newData", newData)
    newData.expenseMembers.map((member) => {
      if(!formData.expenseMembers.includes(member)){
        isMembersUpdated = false
      }
    })
    if(formData.expenseMembers.length !== newData.expenseMembers.length){
      isMembersUpdated = true;
    }
    if(formData.expenseName !== newData.expenseName ||
      formData.expenseDescription !== newData.expenseDescription ||
      formData.expenseAmount !== newData.expenseAmount ||
      formData.expenseType != newData.expenseType ||
      isMembersUpdated){
          return true;
    }else{
      return false
    }  
  }
  const submitHandler = async(data) => {      
    if(user._id !== expense.expenseOwener._id){
      toast.alert("Only owner can change the expense details")
    }
    else if(isFormUpdated(data)){
      const currentValues = getValues();
      const emailArray = data.expenseMembers.map(obj => obj.email);
      const uniqueEmailArray = [...new Set(emailArray)];
      const formData = new FormData();
      formData.append("expenseId", expense._id);
      formData.append('expenseName', data.expenseName)
      formData.append('expenseDescription', data.expenseDescription)
      formData.append('expenseAmount', data.expenseAmount)
      formData.append('expenseTo', JSON.stringify(uniqueEmailArray)) 
      formData.append('expenseType', data.expenseType)
      formData.append("groupId", expense.groupId._id);
      // console.log('Form Data : ', formData);
      try {
        const res = await updateExpense(formData, token);
        //console.log("Update expense response", res)
      } catch (error) {
        //console.error("Error occured while updating expense", error.message)
      }
    }else{
      const toastId = toast.error("No changes are made");

    }
  }
  return (
    <div  className='flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-2 self-start'>
        <div className='text-white font-bold text-[1.1rem]'>{expense.expenseName}</div>
        <div className='text-white text-[14px]'>{date}</div>
      </div>
      
      <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4 mt-8 w-[80%] md:w-[60%] md:px-12 md:py-6 self-center md:border md:border-gray-400 md:rounded-md'>
          <div className='text-[18px] font-semibold text-white'>Update your expense details</div>
          <div className='flex flex-col gap-2 w-[95%]'>
            <label htmlFor='expenseName' className='text-[15px] text-white-100'>Expense Name</label>
            <input type='text' 
            name='expenseName'
            {...register("expenseName")}
            defaultValue={expense.expenseName}
            className='text-[14px] text-gray-400 border border-gray-400 focus:outline-none bg-black-400 px-3 py-1 rounded-md'></input>
          </div>

          <div className='flex flex-col gap-2 w-[95%]'>
            <label htmlFor='expenseDescription' className='text-[15px] text-white-100'>Expense Description</label>
            <textarea type='text' 
            name='expenseDescription'
            {...register("expenseDescription")}
            defaultValue={expense.expenseDescription}
            className='text-[14px] text-gray-400 border border-gray-400 focus:outline-none bg-black-400 px-3 py-1 rounded-md'></textarea>
          </div>

         <div className='flex gap-6 items-center w-[95%]'>
          <div className='flex flex-col gap-2 w-full'>
              <label htmlFor='expenseAmount' className='text-[15px] text-white-100'>Expense Amount</label>
              <input type='text' 
              name='expenseAmount'
              {...register("expenseAmount", {valueAsNumber : true, validate: value => !isNaN(value)})}
              defaultValue={expense.expenseAmount}
              className='text-[14px] text-gray-400 border border-gray-400 focus:outline-none bg-black-400 px-3 py-1 rounded-md'></input>
              {
                errors.expenseAmount && (
                  <p>You can not use alphabets or any special carecter here</p>
                )
              }
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor='expenseType' className='text-[15px] text-white-100'>Expense Type</label>
              <select
              name='expenseType'
              {...register("expenseType")}
              defaultValue={expense.expenseType}
              className='text-[14px] text-gray-400 border border-gray-400 focus:outline-none bg-black-400 px-3 py-1 rounded-md'>
                <option value="Bill">Bill</option>
                <option value="Rent">Rent</option>
                <option value="Repairs">Repairs</option>
                <option value="Travel Expense">Travel Expense</option>
                <option value="Utilities">Utilities</option>
                <option value="Tax">Tax</option>
              </select>
            
            </div>
         </div>
          <div>
          <AddMemberDynamicField
                             name="expenseMembers"
                             label="Add members(Enter email id)"
                             register={register}
                             control={control}
                             defaultValue = {defaultValues}
                             setValue={setValue}
                             errors={errors}></AddMemberDynamicField>
          </div>
         <div className='flex gap-3 mt-4 text-white self-center'>
          <button type='submit' className='px-3 py-1 rounded-md bg-blue-400 text-[14px]'>Update</button>
          <button type='cancel' className='px-3 py-1 rounded-md bg-gray-400 text-[14px]'>Cancel</button>
         </div>
      </form>
      <div className='text-white flex flex-col gap-4 mt-8 md:border md:border-gray-400 md:rounded-md w-[80%] md:w-[60%] md:px-12 md:py-6'>
        <p className='text-white text-[18px] font-bold'>Other Details</p>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-[15px] text-white'>Expense Per Member</div>
            <div className='text-[14px] text-gray-400'>{expense.expensePerMember} ₹</div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[15px]'>Expense Owner Details</p>
            <div className='flex flex-col md:flex-row gap-3 md:gap-6'>
              <div className='flex flex-col gap-1 w-full'>
                <div className='text-[15px] text-white'>Name</div>
                <div className='text-[14px] text-gray-400'>{expenseOwener[0].firstName} <span>{ expenseOwener[0].lastName}</span></div> 
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <div className='text-[15px] text-white'>Email</div>
                <div className='text-[14px] text-gray-400'>{expenseOwener[0].email}</div>
              </div>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-3 md:gap-6'>
            <div className='flex flex-col gap-1 w-full'>
              <div className='text-[15px] text-white'>Group Name</div>
              <div className='text-[14px] text-gray-400'>{expense.groupId.groupName}</div>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <div className='text-[15px] text-white'>Currency</div>
              <div className='text-[14px] text-gray-400'>{expense.expenseCurrency}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutExpene