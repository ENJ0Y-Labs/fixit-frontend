import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./DoubleRangeSlider.css";

function DoubleRangeSlider({
    min = 0,
    max = 100,
    step = 1,
    onChange
}) {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);

    useEffect(() => {
        setMinVal(min);
        setMaxVal(max);
    }, [min, max]);

    useEffect(() => {
        onChange(minVal, maxVal);
    }, [minVal, maxVal, onChange]);

    const range = max - min || 1;
    const minPercent = ((minVal - min) / range) * 100;
    const maxPercent = ((maxVal - min) / range) * 100;

    const handleMinChange = (event) => {
        const value = Number(event.target.value);
        setMinVal(Math.min(value, maxVal - step));
    };

    const handleMaxChange = (event) => {
        const value = Number(event.target.value);
        setMaxVal(Math.max(value, minVal + step));
    };

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

            <div className="double-range-slider__values" aria-live="polite">
                <span>₦{minVal.toLocaleString("en-NG")}</span>
                <span>₦{maxVal.toLocaleString("en-NG")}</span>
            </div>
        </div>
    );
}

DoubleRangeSlider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

export default DoubleRangeSlider;
