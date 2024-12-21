import { useState } from 'react'
import {
  Mode,
  RangeOutput,
  SingleOutput,
} from '../components/NeatDatePicker.type'

const useOutput = (
  mode: Mode,
  today: Date,
  startDate?: Date,
  endDate?: Date,
) => {
  // output decides which date should be active.
  const [output, setOutput] = useState<Output>(
    mode === 'single'
      ? { date: today, startDate: undefined, endDate: undefined }
      : { date: undefined, startDate, endDate },
  )

  // If user presses cancel, reset 'output' state to this 'originalOutput'
  const [originalOutput, setOriginalOutput] = useState<Output>(output)

  return {
    output,
    setOutput,
    originalOutput,
    setOriginalOutput,
  }
}

export default useOutput

type Output = SingleOutput | RangeOutput
