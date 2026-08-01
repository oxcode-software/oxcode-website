"use client";

import { useCountUp } from "@/app/lib/motion";

type StatValueProps = {
  /** Display string such as "120+", "99.2%", "24/7" or "4x". */
  value: string;
};

const NUMERIC = /^(\D*)(\d+(?:\.\d+)?)([\s\S]*)$/;

/** Renders a metric, counting the leading number up when it enters the viewport. */
export default function StatValue({ value }: StatValueProps) {
  const match = NUMERIC.exec(value);
  const target = match ? Number(match[2]) : 0;
  const decimals = match?.[2].includes(".")
    ? match[2].split(".")[1].length
    : 0;

  const { ref, value: current } = useCountUp<HTMLSpanElement>(target, decimals);

  if (!match) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      {match[1]}
      {current.toFixed(decimals)}
      {match[3]}
    </span>
  );
}
