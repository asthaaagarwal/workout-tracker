import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTimerDisplay } from '../utils/dateUtils';

export const useWorkoutTimer = (startTime: Date | null) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time from start time
  const calculateElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    return Date.now() - startTime.getTime();
  }, [startTime]);

  // Start timer
  const startTimer = useCallback(() => {
    if (intervalRef.current) return; // Already running

    intervalRef.current = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 100); // Update every 100ms for tenths display
  }, [calculateElapsedTime]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
  }, [stopTimer]);

  // Effect to start/stop timer based on startTime
  useEffect(() => {
    if (startTime) {
      setElapsedTime(calculateElapsedTime());
      startTimer();
    } else {
      stopTimer();
      setElapsedTime(0);
    }

    return () => stopTimer();
  }, [startTime, calculateElapsedTime, startTimer, stopTimer]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get formatted time display
  const formattedTime = formatTimerDisplay(elapsedTime);

  // Get duration in milliseconds
  const duration = elapsedTime;

  return {
    elapsedTime,
    formattedTime,
    duration,
    startTimer,
    stopTimer,
    resetTimer,
    isRunning: intervalRef.current !== null
  };
};