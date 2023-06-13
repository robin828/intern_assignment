
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ChartComponent } from './ChartComponent';
import './styles.css'
const seriesObject = {
    baseValue: { type: "price", price: 76 },
    topLineColor: "rgba( 38, 166, 154, 1)",
    topFillColor1: "rgba( 38, 166, 154, 0.28)",
    topFillColor2: "rgba( 38, 166, 154, 0.05)",
    bottomLineColor: "rgba( 239, 83, 80, 1)",
    bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
    bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
}
function App(props) {
    const [chartData, setChartData] = useState([]);
    useEffect( ()=>{
        async function fetchData() {
            await Axios.get("http://localhost:3000/api/Data1").then(res=>{
                setChartData(res.data.formattedData1);
            })
          }
        fetchData();
    }, [])
	return (
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
      <div className='my-[32px] text-white text-[32px] text-center'>
            Title
      </div>
      <div className='p-[50px] rounded-xl'>
      <ChartComponent {...props} seriesObject={seriesObject} type="line" data={chartData}></ChartComponent>
      </div>
        </div>
	);
}

export default App;