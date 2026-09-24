import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function DoubleRangeSlider({
    min = 0,
    max = 100,
    step = 1,
    minValue,
    maxValue,
    onChange
}) {
    const [localMin, setLocalMin] = useState(
        minValue ?? min
    );
    const [localMax, setLocalMax] = useState(
        maxValue ?? max
    );

    const currentMin = minValue ?? localMin;
    const currentMax = maxValue ?? localMax;

    useEffect(() => {
        if (minValue !== undefined) {
            setLocalMin(minValue);
        }
    }, [minValue]);

    useEffect(() => {
        if (maxValue !== undefined) {
            setLocalMax(maxValue);
        }
    }, [maxValue]);

    const range = max - min || 1;
    const minPercent = ((currentMin - min) / range) * 100;
    const maxPercent = ((currentMax - min) / range) * 100;

    const updateValues = (nextMin, nextMax) => {
        if (minValue === undefined) {
            setLocalMin(nextMin);
        }

        if (maxValue === undefined) {
            setLocalMax(nextMax);
        }

        onChange(nextMin, nextMax);
    };

    const handleMinChange = (event) => {
        const value = Number(event.target.value);
        const nextMin = Math.min(value, currentMax - step);

        updateValues(nextMin, currentMax);
    };

    const handleMaxChange = (event) => {
        const value = Number(event.target.value);
        const nextMax = Math.max(value, currentMin + step);

        updateValues(currentMin, nextMax);
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
                value={currentMin}
                onChange={handleMinChange}
                aria-label="Minimum price"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={currentMin}
            />

            <input
                className="double-range-slider__input double-range-slider__input--max"
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentMax}
                onChange={handleMaxChange}
                aria-label="Maximum price"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={currentMax}
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
