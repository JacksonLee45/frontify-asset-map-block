import { type FC, useState } from 'react';

interface ColorSwatchProps {
    color: string;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="tw-relative tw-inline-block">
            <button
                type="button"
                className="tw-w-16 tw-h-16 tw-rounded-lg tw-cursor-pointer tw-transition-transform hover:tw-scale-110 tw-shadow-md tw-border tw-border-gray-300"
                style={{ backgroundColor: color }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label={`Color swatch ${color}`}
            />
            {isHovered && (
                <div className="tw-absolute tw-bottom-full tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-mb-2 tw-px-3 tw-py-1 tw-bg-gray-900 tw-text-white tw-text-sm tw-rounded tw-whitespace-nowrap tw-z-10">
                    {color}
                </div>
            )}
        </div>
    );
};

export default ColorSwatch;
