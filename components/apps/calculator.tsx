"use client"

import { useState } from "react"

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(formatResult(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const formatResult = (value: number) => {
    // Handle very large or very small numbers
    if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
      return value.toExponential(3)
    }

    // Convert to string and handle decimal places
    let result = value.toString()

    // If the result is a whole number but came from decimal operations,
    // check if we should add decimal places
    if (Number.isInteger(value) && Math.abs(value) < 1e6) {
      // For integers less than 1 million, show as integer
      return result
    }

    // For decimal numbers, limit to reasonable decimal places
    if (result.includes(".")) {
      // Remove trailing zeros but keep at least one decimal place if it was a decimal operation
      const parts = result.split(".")
      if (parts[1]) {
        // Keep up to 8 decimal places and remove trailing zeros
        const decimals = parts[1].substring(0, 8).replace(/0+$/, "")
        if (decimals.length > 0) {
          result = parts[0] + "." + decimals
        } else {
          result = parts[0]
        }
      }
    }

    // Add thousand separators for large numbers
    if (Math.abs(value) >= 1000 && Number.isInteger(value)) {
      result = value.toLocaleString("en-US")
    }

    return result
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(formatResult(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const toggleSign = () => {
    if (display !== "0") {
      setDisplay(display.charAt(0) === "-" ? display.slice(1) : "-" + display)
    }
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display)
    const result = value / 100
    setDisplay(formatResult(result))
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const formatDisplay = (value: string) => {
    // Handle display length limit
    if (value.length > 12) {
      const num = Number.parseFloat(value)
      if (Math.abs(num) >= 1e9) {
        return num.toExponential(3)
      }
      // Truncate long decimal numbers
      if (value.includes(".")) {
        const parts = value.split(".")
        const availableDecimals = 12 - parts[0].length - 1
        if (availableDecimals > 0) {
          return parts[0] + "." + parts[1].substring(0, availableDecimals)
        } else {
          return parts[0]
        }
      }
    }
    return value
  }

  return (
    <div className="h-full bg-gray-700 flex items-center justify-center p-4">
      <div className="w-80 bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Display */}
        <div className="bg-gray-800 p-6 pb-4">
          <div className="text-right text-white text-5xl font-light tracking-tight overflow-hidden">
            {formatDisplay(display)}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-px bg-gray-900 p-px">
          {/* Row 1 */}
          <button
            className="h-16 bg-gray-500 hover:bg-gray-400 text-black text-xl font-medium transition-colors active:bg-gray-300"
            onClick={clear}
          >
            AC
          </button>
          <button
            className="h-16 bg-gray-500 hover:bg-gray-400 text-black text-xl font-medium transition-colors active:bg-gray-300"
            onClick={toggleSign}
          >
            +/-
          </button>
          <button
            className="h-16 bg-gray-500 hover:bg-gray-400 text-black text-xl font-medium transition-colors active:bg-gray-300"
            onClick={inputPercent}
          >
            %
          </button>
          <button
            className="h-16 bg-orange-500 hover:bg-orange-400 text-white text-2xl font-light transition-colors active:bg-orange-300"
            onClick={() => inputOperation("÷")}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("7")}
          >
            7
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("8")}
          >
            8
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("9")}
          >
            9
          </button>
          <button
            className="h-16 bg-orange-500 hover:bg-orange-400 text-white text-2xl font-light transition-colors active:bg-orange-300"
            onClick={() => inputOperation("×")}
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("4")}
          >
            4
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("5")}
          >
            5
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("6")}
          >
            6
          </button>
          <button
            className="h-16 bg-orange-500 hover:bg-orange-400 text-white text-2xl font-light transition-colors active:bg-orange-300"
            onClick={() => inputOperation("-")}
          >
            -
          </button>

          {/* Row 4 */}
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("1")}
          >
            1
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("2")}
          >
            2
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={() => inputNumber("3")}
          >
            3
          </button>
          <button
            className="h-16 bg-orange-500 hover:bg-orange-400 text-white text-2xl font-light transition-colors active:bg-orange-300"
            onClick={() => inputOperation("+")}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400 col-span-2"
            onClick={() => inputNumber("0")}
          >
            0
          </button>
          <button
            className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-2xl font-light transition-colors active:bg-gray-400"
            onClick={inputDecimal}
          >
            .
          </button>
          <button
            className="h-16 bg-orange-500 hover:bg-orange-400 text-white text-2xl font-light transition-colors active:bg-orange-300"
            onClick={performCalculation}
          >
            =
          </button>
        </div>
      </div>
    </div>
  )
}
