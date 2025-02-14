import React, { useEffect, useState } from "react";

const FormatHour = ({ masterclass }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const isoDate = masterclass.startDate;

    // Convertir en objet Date
    const date = new Date(isoDate);

    // Extraire l'heure
    const hours = date.getHours(); // Heures (format 24h)
    const minutes = date.getMinutes(); // Minutes
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setResult(formattedTime);
  }, []);

  return <>{result}</>;
};

export default FormatHour;
