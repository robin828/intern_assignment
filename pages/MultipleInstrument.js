import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import { staticCandle } from "./utils/StaticCandleChart";
import { combinedThree, combinedTwo } from "./utils/CombinedOHLC";
import { Data1, Data2, Data3 } from "./utils/Data";
import './styles.css'

const candleObject = {
  upColor: "#26a69a",
  downColor: "#ef5350",
  borderVisible: false,
  wickUpColor: "#26a69a",
  wickDownColor: "#ef5350",
};

function MultipleInstrument(props) {
  const [data, setData] = useState([]);
  // const [Data1, setData1] = useState([]);
  // const [Data2, setData2] = useState([]);
  // const [Data3, setData3] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState(0);
  const [selectedOption, setSelectedOption] = useState(60);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleCheckboxChange = (event) => {
    const checkbox = event.target;
    const checkboxId = checkbox.id;
    const isChecked = checkbox.checked;
    setCheckboxValues((prevState) => ({
      ...prevState,
      [checkboxId]: isChecked,
    }));

    // if(isChecked) {

    // }
    // else {

    // }
  };


  const multiSeries = (Data1, Data2) => {
    //console.log(Data1, Data2);
    let combinedOHLC = combinedTwo(Data1, Data2);
    let arr = staticCandle(combinedOHLC, selectedOption, 3);
    setData(arr.sort((a, b) => a.time - b.time));
  };

  useEffect(() => {
    if (
      checkboxValues.checkbox1 &&
      checkboxValues.checkbox2 &&
      checkboxValues.checkbox3
    ) {
        let combinedOHLC = combinedThree([Data1, Data2, Data3]);
        //console.log(combinedOHLC, "{}{}")
        let arr = staticCandle(combinedOHLC, selectedOption, 3);
        setData(arr.sort((a, b) => a.time - b.time));
    } else if (checkboxValues.checkbox1 && checkboxValues.checkbox2) {
      multiSeries(Data1, Data2);
    } else if (checkboxValues.checkbox2 && checkboxValues.checkbox3) {
      multiSeries(Data2, Data3);
    } else if (checkboxValues.checkbox3 && checkboxValues.checkbox1) {
      multiSeries(Data1, Data3);
    } else if (checkboxValues.checkbox1) {
      let arr = staticCandle(Data1, selectedOption, 1);
      setData(arr.sort((a, b) => a.time - b.time));
    } else if (checkboxValues.checkbox2) {
      let arr = staticCandle(Data2, selectedOption, 1);
      setData(arr.sort((a, b) => a.time - b.time));
    } else if (checkboxValues.checkbox3) {
      let arr = staticCandle(Data3, selectedOption, 1);
      setData(arr.sort((a, b) => a.time - b.time));
    }
    else {
        setData([])
    }
  }, [checkboxValues, selectedOption]);
  return (
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
    <div className='my-[32px] text-white text-[32px] text-center'>
          Multiple Instrument
    </div>
    <div className="p-[50px]" >
      <div  className="my-[50px] flex gap-[20px]">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={checkboxValues.checkbox1}
            id="checkbox1"
            onChange={handleCheckboxChange}
            className="form-checkbox text-indigo-600 h-5 w-5"
          />
          <span className="ml-2 text-white">Checkbox 1</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={checkboxValues.checkbox2}
            id="checkbox2"
            onChange={handleCheckboxChange}
            className="form-checkbox text-indigo-600 h-5 w-5"
          />
          <span className="ml-2 text-white">Checkbox 2</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={checkboxValues.checkbox3}
            id="checkbox3"
            onChange={handleCheckboxChange}
            className="form-checkbox text-indigo-600 h-5 w-5"
          />
          <span className="ml-2 text-white">Checkbox 3</span>
        </label>
      </div>

      <ChartComponent
        {...props}
        data={data}
        seriesObject={candleObject}
        type={"candle"}
      ></ChartComponent>
      <div className="flex items-center space-x-4 my-[20px]">
        <label htmlFor="dropdown" className="text-white">
          Select an option:
        </label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleSelectChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={60}>1 min</option>
          <option value={60}>1 min</option>
          <option value={300}>5 min</option>
          <option value={1800}>30 min</option>
        </select>
        </div>
      </div>
      </div>
  );
}

export default MultipleInstrument;
