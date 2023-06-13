
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { TwoChartComponent } from './TwoChartComponent';
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
    const [chart1, setChart1] = useState([]);
    useEffect( ()=>{
        async function fetchData() {
            await Axios.get("http://localhost:3000/api/Data1").then(res=>{
                console.log(res.data.formattedData1)
                setChart1(res.data.formattedData1);
            })
          }
        fetchData();
    }, [])
	return (
        
		<TwoChartComponent {...props} seriesObject={seriesObject} type="line" data={chart1}></TwoChartComponent>
	);
}

export default App;