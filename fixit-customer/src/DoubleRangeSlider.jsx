import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./DoubleRangeSlider.css";

function DoubleRangeSlider({
    min = 0,
    max = 100,
    step = 1,
    minValue = min,
    maxValue = max,
    onChange
}) {
    const [minVal, setMinVal] = useState(minValue);
    const [maxVal, setMaxVal] = useState(maxValue);

    useEffect(() => {
        setMinVal(minValue);
    }, [minValue]);

    useEffect(() => {
        setMaxVal(maxValue);
    }, [maxValue]);

    const updateValues = (nextMin, nextMax) => {
        setMinVal(nextMin);
        setMaxVal(nextMax);
        onChange(nextMin, nextMax);
    };

    const handleMinChange = (event) => {
        const value = Number(event.target.value);
        updateValues(Math.min(value, maxVal - step), maxVal);
    };

    const handleMaxChange = (event) => {
        const value = Number(event.target.value);
        updateValues(minVal, Math.max(value, minVal + step));
    };

    const range = max - min || 1;
    const minPercent = ((minVal - min) / range) * 100;
    const maxPercent = ((maxVal - min) / range) * 100;

    return (
        <div
            className="double-range-slider"
            style={{
                "--range-start": `${minPercent}%`,
                "--range-end": `${maxPercent}%`
            }}
        >
            <div className="double-range-slider__track" aria-hidden="true">
                <div className="double-range-slider__range" />
            </div>

            <input
                className="double-range-slider__input double-range-slider__input--min"
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={handleMinChange}
                aria-label="Minimum price"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={minVal}
            />

            <input
                className="double-range-slider__input double-range-slider__input--max"
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={handleMaxChange}
                aria-label="Maximum price"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={maxVal}
            />
        </div>
    );
}

DoubleRangeSlider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

export default DoubleRangeSlider;
