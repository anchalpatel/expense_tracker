import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { MdClose } from "react-icons/md";
import { useSelector } from 'react-redux';
import { addExpense } from '../../../../../Services/operations/expense';
import {toast} from 'react-toastify';
import { useParams } from 'react-router-dom';

function CreateExpenseModal({setAddExpenseModal, groupMembers}) {
  const { token } = useSelector((state) => state.auth);
  const { group } = useSelector((state) => state.group);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();
  id = id.substring(1);
  const [isOtherExpense, setIsOtherExpense] = useState(false); 

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues : {
            expenseTo : [],
        }
    });
    const selectedMembers = watch('expenseTo')
    const submitHandler = async (data) => {
        //console.log("Printing data : ", selectedMembers)
        const toastId = toast.loading('Loading...', { autoClose: false });
        const formData = new FormData();
    
        formData.append("expenseName", data.expenseName);
        formData.append("expenseDescription", data.expenseDescription);
        formData.append("expenseAmount", data.expenseAmount);
        formData.append("expenseType", data.expenseType);
        formData.append("groupId", id);
        formData.append("expenseTo", selectedMembers)
        // Append expenseTo as an array
    
        setLoading(true); 
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        const result = await addExpense(formData, token, id);
        //console.log("Printing  result :", result);
        if (!result) {
            toast.error("Error occurred while adding Expense");
        } else {
            // Dismiss the modal if the form submission is successful
            setAddExpenseModal(false);
        }
        setLoading(false);
        toast.dismiss(toastId);
    };
    
    return (
      <div className='fixed  inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
          <div className='bg-black-400 border border-gray-500 rounded-xl'>
              <div className='flex justify-between items-center bg-gray-600 px-4 py-2 rounded-t-xl text-[16px] text-white'>
                  <p>Add Expense</p>
                  <MdClose onClick={()=>(setAddExpenseModal(false))}/>
              </div>
              <div className='text-[14px] text-gray-400 px-6 py-5'>
                  <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-3'>
                  {/* name div */}
                      <div className='flex flex-col gap-2'>
                          <label htmlFor='expenseName' className='text-[15px] text-white-100'>Expense Name <sup className='text-pink-200'>*</sup></label>
                          <input
                                  id='expenseName'
                                  {...register("expenseName", {required:true})}
                                  placeholder='Light Bill paid'
                                  className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'></input>
                          {
                              errors.expenseName && (
                                  <span className='text-[14px] text-pink-200'>Expense Name is require**</span>
                              )
                          }        
                      </div>

                      {/* description div */}
                      <div className='flex flex-col gap-2'>
                          <label htmlFor='expenseDescription' className='text-[15px] text-white-100'>Expense Description <sup className='text-pink-200'>*</sup></label>
                          <textarea
                                  id='expenseDescription'
                                  {...register("expenseDescription", {required:true})}
                                  placeholder='Write your discription here'
                                  className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'></textarea>
                          {
                              errors.expenseDescription && (
                                  <span className='text-[14px] text-pink-200'>Expense Descripton is require**</span>
                              )
                          }        
                      </div>

                        {/* amount and type div */}
                        <div className='flex flex-col gap-5 lg:flex-row'>
                        <div className='flex flex-col gap-2 lg:w-[48%]'>
                            <label htmlFor='expenseAmount' className='text-[15px] text-white-100'>Expense Amount <sup className='text-pink-200'>*</sup></label>
                            <input
                            id='expenseAmount'
                            {...register("expenseAmount", { required: true })}
                            placeholder='2000'
                            className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'></input>
                            {errors.expenseAmount && (
                            <span className='text-[14px] text-pink-200'>Expense Amount is required**</span>
                            )}
                        </div>
                        <div className='flex flex-col gap-2 lg:w-[48%]'>
                            <label htmlFor='expenseType' className='text-[15px] text-white-100'>Expense Type <sup className='text-pink-200'>*</sup></label>
                            <select
                            id='expenseType'
                            {...register("expenseType", { required: true })}
                            className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'
                            onChange={(e) => setIsOtherExpense(e.target.value === "Other")}
                            >
                            <option value="">Select type</option>
                            <option value="Bill">Bill</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Rent">Rent</option>
                            <option value="Rent">Trip</option>
                            <option value="Rent">Food</option>
                            <option value="Rent">Stationary</option>
                            <option value="Other">Other</option>
                            </select>
                            {errors.expenseType && (
                            <span>Expense Type is required**</span>
                            )}
                            {isOtherExpense && (
                            <input
                                id='otherExpenseType'
                                {...register("otherExpenseType", { required: isOtherExpense })}
                                placeholder='Specify other expense type'
                                className='bg-black-400 border-[0.5px] focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md mt-2'></input>
                            )}
                            {errors.otherExpenseType && (
                            <span className='text-[14px] text-pink-200'>Other Expense Type is required**</span>
                            )}
                        </div>
                        </div>
                        <div>
                            <label htmlFor='expenseTo' className='text-[15px] text-white-100'>Expense Memebrs <sup className='text-pink-200'>*</sup></label>
                            <div className='flex flex-col gap-2 mt-2'>
                                {
                                    groupMembers.map((member, index)=>(
                                        <div key={index} className='flex gap-2 items-center'>
                                            <input type='checkbox'
                                            {...register('expenseTo')}
                                            id={`groupMember-${index}`}
                                            value={member.email}></input>
                                            <label htmlFor={`groupMember-${index}`}>{member.firstName + " " + member.lastName}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                      <button type='submit' className='bg-blue-400 text-white-100 mt-2 px-3 py-2 rounded-md self-center hover:bg-black-400 hover:border hover:shadow-md hover:border-gray-400 hover:scale-90 transition-all duration-500'>Create</button>

                  </form>
              </div>
          </div>
      </div>
    )
}

export default CreateExpenseModal
