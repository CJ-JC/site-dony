import React from "react";

export const CalculateDuration = ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (durationInDays > 1) {
    return `${durationInDays} jours`;
  }

  const durationInHours = Math.ceil((end - start) / (1000 * 60 * 60));
  return `${durationInHours} heures`;
};
