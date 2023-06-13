
import { createChart } from 'lightweight-charts';
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
} from 'react';
import Axios from 'axios';


const Context = createContext();

const initialData = [
	{ time: '2018-10-11', value: 52.89 },
	{ time: '2018-10-12', value: 51.65 },
	{ time: '2018-10-13', value: 51.56 },
	{ time: '2018-10-14', value: 50.19 },
	{ time: '2018-10-15', value: 51.86 },
	{ time: '2018-10-16', value: 51.25 },
];
let currentDate = new Date(initialData[initialData.length - 1].time);

export const LiveChart = props => {
	const {
		colors: {
			backgroundColor = 'white',
			lineColor = '#2962FF',
			textColor = 'black',
		} = {},
	} = props;

	const [chartLayoutOptions, setChartLayoutOptions] = useState({});

	// The following variables illustrate how a series could be updated.
	const series1 = useRef(null);
	const [started, setStarted] = useState(false);
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

    // const currentDate = new Date(chart1[chart1.length - 1].time);

	// The purpose of this effect is purely to show how a series could
	// be updated using the `reference` passed to the `Series` component.
    let i =0;
	useEffect(() => {
		if (series1.current === null) {
			return;
		}

		if (started) {
			const interval = setInterval(() => {
                // console.log(currentDate.getTime(),"{}{}")
                i=i+1;
                console.log(i);
				currentDate.setDate(currentDate.getDate() + 1);
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
			<button type="button" onClick={() => setStarted(current => !current)}>
				{started ? 'Stop updating' : 'Start updating series'}
			</button>
			<Chart layout={chartLayoutOptions}>
				<Series
					ref={series1}
					type={'line'}
					data={initialData}
					color={lineColor}
                    baseValue= {{type: 'price', price: 75}}
                    topLineColor= 'rgba( 38, 166, 154, 1)'
                     topFillColor1= 'rgba( 38, 166, 154, 0.28)'
                     topFillColor2= 'rgba( 38, 166, 154, 0.05)' 
                     bottomLineColor= 'rgba( 239, 83, 80, 1)'
                     bottomFillColor1= 'rgba( 239, 83, 80, 0.05)' 
                     bottomFillColor2= 'rgba( 239, 83, 80, 0.28)'
				/>
			</Chart>
		</>
	);
};

export function Chart(props) {
	const [container, setContainer] = useState(false);
	const handleRef = useCallback(ref => setContainer(ref), []);
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
                    timeScale:{
                        timeVisible:true,
                        secondsVisible:false,
                      }
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

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
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
ChartContainer.displayName = 'ChartContainer';

export const Series = forwardRef((props, ref) => {
	const parent = useContext(Context);
	const context = useRef({
		api() {
			if (!this._api) {
				const { children, data, type, ...rest } = props;
				this._api = type === 'line'
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
Series.displayName = 'Series';

export default LiveChart;