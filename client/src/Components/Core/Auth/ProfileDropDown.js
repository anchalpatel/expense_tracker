import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { logout } from '../../../Services/operations/authAPI';
import { LuLayoutDashboard } from "react-icons/lu";
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { TbLogout2 } from "react-icons/tb";
import { checkTokenValidity } from '../../../Utils/CheckToken';

function ProfileDropDown() {
    const {user} = useSelector((state)=> state.profile);
    const dispatch = useDispatch();
    const nevigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, ()=>setOpen(false));
    
    //if(!user)return null;
  return (
    <div>
        <button onClick={()=>setOpen(true)} className='relative'>
            <div className='flex gap-4 justify-center items-center font-medium text-[20px]'>
            <img src={user?.profileImage}
            alt={user?.firstName}
            onClick={()=>setOpen(true)} className='w-[30px] aspect-square rounded-full object-cover'></img>
            <IoMdArrowDropdown className='text-sm text-gray-200'/>
            </div>
            {
            open && (
                <div className='absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-gray-400' ref={ref}>
                    <div onClick={(e)=>e.stopPropagation} className=' border-b-[1px] border-b-gray-400'>
                        <Link to={checkTokenValidity() ? '/dashboard/aboutUser' : '/login   '} onClick={() => setOpen(false)}>
                            <div className='flex gap-3 text-[15px] text-gray-400 justify-start items-center px-3 py-2'>
                                <LuLayoutDashboard className='text-[18px]'/>
                                <p>Dashboard</p>
                            </div>
                        </Link>
                    </div>
                    <div onClick={
                        ()=>{
                            dispatch(logout(nevigate))
                            setOpen(false)
                        }
                    } className='flex gap-3 text-[15px] text-gray-400 justify-start items-center px-3 py-2'>
                        <TbLogout2 className='text-[18px]'/>
                        Logout
                    </div>
                </div>
            )
        }
        </button>
        
    </div>
  )
}

export default ProfileDropDown