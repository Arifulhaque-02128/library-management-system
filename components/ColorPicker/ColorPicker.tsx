'use client';

import { useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface ColorProps {
  value?: string;
  setValue: (name: string, value: any) => void;
  isFieldRequired : boolean
}

const ColorPicker = ({ setValue, value, isFieldRequired }: ColorProps) => {
  const [color, setColor] = useState(value || "#aabbcc");

  useEffect(() => {
    setColor(value || "#aabbcc"); // sync with form value when props change
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setValue("coverColor", newColor); // update form value
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center gap-1">
        <span>#</span>
        <HexColorInput
          color={color}
          onChange={handleColorChange}
          className="hex-input"
          required={isFieldRequired}
        />
      </div>

      <HexColorPicker
        color={color}
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPicker;
