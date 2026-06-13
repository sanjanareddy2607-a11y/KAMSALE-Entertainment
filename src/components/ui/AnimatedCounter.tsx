import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  isActive: boolean;
}

export function AnimatedCounter({ value, suffix = "", isActive }: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [text, setText] = useState("0");

  useEffect(() => {
    if (isActive) {
      spring.set(value);
    }
  }, [isActive, value, spring]);

  useEffect(() => {
    return display.on("change", (v) => setText(String(v)));
  }, [display]);

  return (
    <motion.span className="tabular-nums">
      {text}
      {suffix}
    </motion.span>
  );
}
