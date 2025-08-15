import React, { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      const progress = timestamp - startTimeRef.current;
      const t = Math.min(progress / duration, 1);
      const easedT = easeOutExpo(t);
      const currentCount = Math.floor(easedT * end);
      
      setCount(currentCount);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = undefined;
    };
  }, [end, duration]);

  return count.toLocaleString();
};

export default useCountUp;
