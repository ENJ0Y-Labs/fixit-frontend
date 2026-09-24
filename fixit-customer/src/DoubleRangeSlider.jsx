// fixit-customer/src/DoubleRangeSlider.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function DoubleRangeSlider({
    min = 0,
    max = 100,
    onChange
}) {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);

    const range = useRef(null);
    const thumbLeft = useRef(null);
    const thumbRight = useRef(null);

    const getPercent = useCallback(
        (value) => {
            if (max === min) {
                return 0;
            }

            return Math.round(
                ((value - min) / (max - min)) * 100
            );
        },
        [min, max]
    );

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxVal);

        if (thumbLeft.current) {
            thumbLeft.current.style.left = `${minPercent}%`;
            thumbLeft.current.style.transform = "translateX(-50%)";
        }

        if (thumbRight.current) {
            thumbRight.current.style.left = `${maxPercent}%`;
            thumbRight.current.style.transform = "translateX(-50%)";
        }

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, maxVal, getPercent]);

    useEffect(() => {
        onChange(minVal, maxVal);
    }, [minVal, maxVal, onChange]);

    return (
        <div className="double-range-slider">

            <div className="slider-track">
                <div
                    ref={range}
                    className="slider-range"
                ></div>
            </div>

            <input
                ref={thumbLeft}
                className="range-input range-input-left"
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(
                        Number(event.target.value),
                        maxVal - 1
                    );

                    setMinVal(value);
                }}
            />

            <input
                ref={thumbRight}
                className="range-input range-input-right"
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(
                        Number(event.target.value),
                        minVal + 1
                    );

                    setMaxVal(value);
                }}
            />

            <div className="range-values">
                <span>₦{minVal.toLocaleString("en-NG")}</span>
                <span>₦{maxVal.toLocaleString("en-NG")}</span>
            </div>

        </div>
    );
}

DoubleRangeSlider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

export default DoubleRangeSlider;