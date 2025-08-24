
import { useEffect, useState } from "react";

export default function Countdown({ targetDateString }: { targetDateString: string }) {
  const targetDate = new Date(targetDateString);
  const [timeLeft, setTimeLeft] = useState<number>(targetDate.getTime() - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) return <span className="text-green-600 font-bold">Available Now</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="text-lg font-semibold text-blue-600">
      {hours}h {minutes}m {seconds}s
    </span>
  );
}
