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

export const LiveChart = (props) => {
  const {
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
    } = {},
  } = props;

  const [chartLayoutOptions, setChartLayoutOptions] = useState({});

  const series1 = useRef(null);
  const [started, setStarted] = useState(false);
  const [chart1, setChart1] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const url = "https://intern-assignment-lgl7-m3i83yz4g-robin828.vercel.app/api/Data1"
      // const url = "http://localhost:3000/api/Data1"
      await Axios.get(`${url}`).then((res) => {
        setChart1(res.data.formattedData1);
      });
    }
    fetchData();
  }, []);
  let i = 0;
  useEffect(() => {
    if (series1.current === null) {
      return;
    }

    if (started) {
      const interval = setInterval(() => {
        i = i + 1;
        const next = {
          time: chart1[i].time,
          value: chart1[i].value,
        };
        series1.current.update(next);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started]);

  useEffect(() => {
    setChartLayoutOptions({
      background: {
        color: backgroundColor,
      },
      textColor,
    });
  }, [backgroundColor, textColor]);

  return (
    <>
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
      <div className='my-[32px] text-white text-[32px] text-center'>
          Line Live Chart
    </div>
    <div className='p-[50px] rounded-xl'>
      <button type="button"  className="text-[#333333] p-3 my-[16px] bg-white rounded-lg cursor-pointer" onClick={() => setStarted((current) => !current)}>
        {!started && "Start updating series"}
      </button>
      <Chart layout={chartLayoutOptions}>
        <Series
          ref={series1}
          type={"line"}
          baseValue= { {type: "price", price: 76} }
          // data={initialData}
          upColor= '#26a69a' 
          downColor= '#ef5350'
          wickUpColor= '#26a69a'
           wickDownColor= '#ef5350'
           barSpacing= {10}
        borderColor= 'red'
        />
      </Chart>
      
  </div>
        </div>
      
    </>
  );
};

export function Chart(props) {
  const [container, setContainer] = useState(false);
  const handleRef = useCallback((ref) => setContainer(ref), []);
  return (
    <div ref={handleRef}>
      {container && <ChartContainer {...props} container={container} />}
    </div>
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
            secondsVisible: false,
          },
        });
        this._api.timeScale().fitContent();
      }
      return this._api;
    },
    free() {
      if (this._api) {
        // this._api.remove();
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
      chart.remove();
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
        const { children, data, type, ...rest } = props;
        this._api =
          type === "line"
            ? parent.api().addBaselineSeries(rest)
            : parent.api().addCandlestickSeries(rest);
        // this._api.setData(data);
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

export default LiveChart;
