import React, {
    createContext,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
  } from "react";

const ChartContainer = forwardRef((props, ref) => {
    const { children, container, layout, ...rest } = props;
    const Context = createContext();

  
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

export default ChartContainer;