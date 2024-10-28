import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { balanceSheet } from '../../../../Services/operations/group';
import BalanceSheetCard from '../../../Common/BalanceSheetCard';
import { useParams } from 'react-router-dom';

function BalanceSheet() {
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { group } = useSelector((state) => state.group);
  const { token } = useSelector((state) => state.auth);
  const {id} = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = { groupId: id };
        const response = await balanceSheet(data, token);
        //console.log("Balance Sheet Data:", response.data);
        setBalanceData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to prevent memory leaks
    return () => {};
  }, [id, token]);

  const handleSettlement = (index) => {
    // Refresh the balance sheet data after settlement
    setBalanceData(prevBalanceData => prevBalanceData.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-y-6 rounded-md p-8 px-12">
      <h2 className="text-lg font-semibold text-white-100">Balance Sheet</h2>
      {loading ? (
        <p>Loading balance sheet...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : balanceData.length === 0 ? (
        <p>No balance sheet data available.</p>
      ) : (
        balanceData.map((data, index) => (
          <div key={index} className="mt-4">
            <BalanceSheetCard 
              data={data} 
              token={token} 
              groupId={id} 
              onSettlement={() => handleSettlement(index)} 
            />
          </div>
        ))
      )}
    </div>
  );
}

export default BalanceSheet;
