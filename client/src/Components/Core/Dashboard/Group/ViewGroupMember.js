import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { viewGroup } from '../../../../Services/operations/group';


function ViewGroupMember() {
  
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  let { id } = useParams();
  

  const fetchData = async () => {
    setLoading(true);
    try {
      
      const result = await viewGroup({groupId : id});
      if (result) {
        setGroupData(result.group); 
      }
    } catch (error) {
     // console.error('Error fetching group data:', error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token]);
 

  return (
    <div className="my-10 w-[90%] md:w-[70%]">
      {groupData ? (
        <div className="flex flex-col gap-y-6 rounded-md border-[1px] border-gray-500 p-8 px-12">
        <h2 className="text-lg font-semibold text-white-100">Group Details</h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label>
              <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
                Group Name
              </p>
              <p className='bg-black-400 border-[0.5px] text-gray-100 focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'>{groupData.groupName}</p>
            </label>
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label>
              <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
                Created At
              </p>
              <p className='bg-black-400 border-[0.5px] text-gray-100 focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'> {new Date(groupData.createdAt).toLocaleString()}</p>
            </label>
          </div>
        </div>
 
        <div className="">
        <p className="mb-1 text-[1rem] leading-[1.375rem] text-white-100">
             Group Members
        </p>
          <ul className='flex flex-col gap-2'>
            {groupData.groupMembers.map((member) => (
              <li key={member._id} className='bg-black-400 border-[0.5px] text-gray-100 focus:outline-none text-[14px] border-gray-500 px-3 py-2 rounded-md'>
                {member.firstName} {member.lastName} 
              </li>
            ))}
          </ul>
        </div>
      </div>
      ) : (
        <p className="text-white-100">Loading group data...</p>
      )}
    </div>
  );
}

export default ViewGroupMember;
