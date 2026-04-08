/* ================================================================
   useBoxAnimator
   Gently oscillates AI detection box positions to simulate
   real-time tracking jitter on live video frames.
   ================================================================ */
import { useState, useEffect, useRef } from "react";

export function useBoxAnimator(initialBoxes) {
  const [boxes, setBoxes] = useState(initialBoxes);
  const t = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      t.current += 0.04;
      const tick = t.current;
      setBoxes(
        initialBoxes.map((b, i) => ({
          ...b,
          left: b.left + Math.sin(tick * b.dx + i * 0.7) * 2,
          top:  b.top  + Math.cos(tick * b.dy + i * 0.5) * 1.5,
        }))
      );
    }, 120);
    return () => clearInterval(id);
  }, [initialBoxes]);

  return boxes;
}
