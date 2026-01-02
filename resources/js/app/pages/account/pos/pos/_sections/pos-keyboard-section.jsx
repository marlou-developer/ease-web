import React from "react";
import { Delete } from "lucide-react";

const NumberKeyboard = ({ value = "", onChange, className = "" }) => {
  
  const handleKeyPress = (key) => {
    let newValue = String(value);

    if (key === "BACKSPACE") {
      newValue = newValue.slice(0, -1);
    } else if (key === ".") {
      // Prevent multiple decimals
      if (!newValue.includes(".")) {
        newValue = newValue === "" ? "0." : newValue + ".";
      }
    } else {
      // Prevent leading zeros unless followed by decimal
      if (newValue === "0") {
        newValue = key;
      } else {
        newValue += key;
      }
    }

    onChange(newValue);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "BACKSPACE"];

  return (
    <div className={`grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded-xl w-full  ${className}`}>
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => handleKeyPress(key)}
          className={`
            flex items-center justify-center h-14 rounded-lg text-xl font-semibold transition-active
            active:bg-blue-500 active:text-white
            ${key === "BACKSPACE" ? "bg-red-50 text-red-600" : "bg-white text-gray-800 shadow-sm"}
          `}
        >
          {key === "BACKSPACE" ? <Delete size={24} /> : key}
        </button>
      ))}
    </div>
  );
};

export default NumberKeyboard;