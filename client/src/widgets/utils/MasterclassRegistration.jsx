import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const MasterclassRegistration = ({ handleCheckoutClick, startDate }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const start = new Date(startDate);
      setIsExpired(now >= start); // Expiration dès que startDate est atteint
    };

    checkExpiration(); // Vérifie immédiatement

    const timer = setInterval(checkExpiration, 1000); // Vérifie chaque seconde

    return () => clearInterval(timer); // Nettoyage du timer
  }, [startDate]);

  return (
    <div className="text-center">
      <Button
        size="md"
        disabled={isExpired}
        className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-400"
        onClick={handleCheckoutClick}
      >
        {isExpired ? "Inscription fermée" : "S'inscrire à la masterclass"}
      </Button>
    </div>
  );
};

export default MasterclassRegistration;
