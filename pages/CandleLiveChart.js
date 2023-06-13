import { createChart } from "lightweight-charts";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Axios from "axios";
import './styles.css'

const Context = createContext();

export const CandleLiveChart = (props) => {
  const {
    colors: {
        upColor= '#26a69a' ,
        downColor= '#ef5350',
        borderVisible= false,
        wickUpColor= '#26a69a',
         wickDownColor= '#ef5350'
    } = {},
  } = props;

  const [chartLayoutOptions, setChartLayoutOptions] = useState({});

  const [selectedOption, setSelectedOption] = useState(60);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // The following variables illustrate how a series could be updated.
  const series1 = useRef(null);
  const [started, setStarted] = useState(false);
  const [chart1, setChart1] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await Axios.get("http://localhost:3000/api/Data2").then((res) => {
        setChart1(res.data.ohlcData);
      })
    }
    fetchData();
  }, []);

  let i = 0;
  let j =0;
  let high = 0;
  let low = chart1[0]?.low;
  useEffect(() => {
    if (series1.current === null) {
      return;
    }
    if (started) {
        let next = {};

        
      const interval = setInterval(() => {
        if(chart1[i].time - chart1[j].time >= selectedOption) {
        next = {
          time: chart1[i].time,
          close: chart1[i].close,
          open: chart1[i].open,
          high: chart1[i].high,
          low: chart1[i].low,
        };
        high = chart1[i].high;
        low = chart1[i].low;
        j=i;
        }
        else {
            high = Math.max(high, chart1[i].high);
            low = Math.min(low, chart1[i].low);
            next = {
                time: chart1[j].time,
                close: chart1[i].close,
                open: chart1[j].open,
                high: high,
                low: low,
              };

        }
        console.log(next)
        series1.current.update(next);
        i = i + 1;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started]);
  useEffect(() => {
    setChartLayoutOptions({
      background: { type: 'solid', color: 'white' 
      },
      textColor: 'black',
    });
  }, []);

  return (
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
    <div className='my-[32px] text-white text-[32px] text-center'>
          Candle Live Chart
    </div>
    <div className='p-[50px] rounded-xl'>
      <button type="button"  className="text-[#333333] p-3 my-[16px] bg-white rounded-lg cursor-pointer" onClick={() => setStarted((current) => !current)}>
      {!started && "Start updating candle"}
      </button>
      <Chart layout={chartLayoutOptions}>
        <Series
          ref={series1}
          type={"candle"}
          // data={initialData}
          upColor= '#26a69a' 
          downColor= '#ef5350'
          wickUpColor= '#26a69a'
           wickDownColor= '#ef5350'
           barSpacing= {10}
        borderColor= 'red'
        />
      </Chart>
      <div className="flex items-center space-x-4 my-[16px] ">
        <label htmlFor="dropdown" className="text-white ">
          Select an option:
        </label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleSelectChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={60}>1 min</option>
          <option value={120}>2 min</option>
          <option value={300}>5 min</option>
          <option value={1800}>30 min</option>
        </select>
      </div>
  </div>
        </div>
  );
};

export function Chart(props) {
  const [container, setContainer] = useState(false);
  const handleRef = useCallback((ref) => setContainer(ref), []);
  return (
    <>
    <div ref={handleRef}>
      {container && <ChartContainer {...props} container={container} />}
    </div>
    
    </>
  );
}

export const ChartContainer = forwardRef((props, ref) => {
  const { children, container, layout, ...rest } = props;

  const chartApiRef = useRef({
    api() {
      if (!this._api) {
        this._api = createChart(container, {
          ...rest,
          layout,
          width: container.clientWidth,
          height: 300,
          timeScale: {
            timeVisible: true,
            secondsVisible: true,
          },
        });
        this._api.timeScale().fitContent();
      }
      return this._api;
    },
    free() {
      if (this._api) {
        this._api.remove();
      }
    },
  });

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    const chart = currentRef.api();

    const handleResize = () => {
      chart.applyOptions({
        ...rest,
        width: container.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart?.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api();
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api().applyOptions(rest);
  }, []);

  useImperativeHandle(ref, () => chartApiRef.current.api(), []);

  useEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api().applyOptions({ layout });
  }, [layout]);

  return (
    <Context.Provider value={chartApiRef.current}>
      {props.children}
    </Context.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

export const Series = forwardRef((props, ref) => {
  const parent = useContext(Context);
  const context = useRef({
    api() {
      if (!this._api) {
        console.log(props)
        const { children, data, type, ...rest } = props;
        this._api = type !== "line" && parent.api().addCandlestickSeries({ ...rest });
      }
      return this._api;
    },
    free() {
      if (this._api) {
        parent.free();
      }
    },
  });

  useLayoutEffect(() => {
    const currentRef = context.current;
    currentRef.api();

    return () => currentRef.free();
  }, []);

  useLayoutEffect(() => {
    const currentRef = context.current;
    const { children, data, ...rest } = props;
    currentRef.api().applyOptions(rest);
  });

  useImperativeHandle(ref, () => context.current.api(), []);

  return (
    <Context.Provider value={context.current}>
      {props.children}
    </Context.Provider>
  );
});
Series.displayName = "Series";

export default CandleLiveChart;
