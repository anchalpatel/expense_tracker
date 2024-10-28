import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale);



function ViewGroupDailyExpense({groupId, expenseData}) {
  //console.log('DAILY EXPENSE DATA : ', expenseData)
  const [loading, setLoading] = useState(false);
  const dataPoints = expenseData.map((item) => ({
    x: new Date(item._id.year, item._id.month - 1, item._id.date),
    y: item.expenseAmount,
  }));

  
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Daily User Expense',
      },
    },
    scales: {
      x: {
        type: 'time', // Use 'time' for x-axis
        time: {
          unit: 'day', // set the time unit to day
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Expense Amount',
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: 'Daily Expense',
        data: dataPoints,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='sm:[15rem] md:h-[22rem] border border-gray-500 rounded-md px-7 py-3'>
    <p className='text-[16px] text-white-100'>User Daily Expense Statistics</p>
    {!loading && expenseData.length > 0 && (
        <Line options={options} className='sm:[15rem] md:h-[20.3rem]' data={data} />
    )}
    {!loading && expenseData.length==0 && (
        <div className='h-full text-[16px] text-gray-400 flex justify-center items-center'>
                You do not have any expense since past one month
        </div>
    )}
</div>
  );
}

export default ViewGroupDailyExpense