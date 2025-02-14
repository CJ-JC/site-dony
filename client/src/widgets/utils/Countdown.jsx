import { useState, useEffect } from "react";

function Countdown({ targetDate, startDate, endDate }) {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(targetDate, startDate, endDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate, startDate, endDate));
    }, 1000);

    return () => clearInterval(timer); // Nettoyage à la fin
  }, [targetDate, startDate, endDate]);

  function calculateTimeLeft(target, start, end) {
    const now = new Date();

    // Cas où la masterclass est terminée
    if (end && now > new Date(end)) {
      return { status: "finished" };
    }

    // Cas où la masterclass est en cours
    if (start && now >= new Date(start) && now <= new Date(end)) {
      return { status: "in_progress" };
    }

    // Cas où la masterclass n'a pas encore commencé (avant `targetDate`)
    const difference = new Date(target) - now;

    if (difference > 0) {
      return {
        status: "counting_down",
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    // Par défaut, on retourne que la masterclass est terminée
    return { status: "finished" };
  }

  if (timeLeft.status === "finished") {
    return <span className="text-red-500">La masterclass est terminée !</span>;
  }

  if (timeLeft.status === "in_progress") {
    return (
      <span className="text-green-500">La masterclass est en cours !</span>
    );
  }

  if (timeLeft.status === "counting_down") {
    return (
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-gray-900">
            {timeLeft.days}
          </div>
          <span className="text-sm text-gray-500 dark:text-black">Jours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-gray-900">
            {timeLeft.hours}
          </div>
          <span className="text-sm text-gray-500 dark:text-black">Heures</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-gray-900">
            {timeLeft.minutes}
          </div>
          <span className="text-sm text-gray-500 dark:text-black">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-gray-900">
            {timeLeft.seconds}
          </div>
          <span className="text-sm text-gray-500 dark:text-black">
            Secondes
          </span>
        </div>
      </div>
    );
  }

  return null; // Si aucun état n'est défini (cas extrême)
}

export default Countdown;
