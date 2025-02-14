import { Euro, ShoppingBag, ShoppingCart, Users2 } from "lucide-react";
import React from "react";

const HeaderAdmin = ({ users, purchases, totalBenefits, courses }) => {
  const formattedNumber = users.length.toLocaleString("fr-FR");
  const formattedNumberPurchases = purchases.length.toLocaleString("fr-FR");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-md dark:bg-[#25303F]">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-lg font-medium dark:text-white">
              {formattedNumberPurchases}
            </h4>
            <span className="text-sm font-normal text-blue-gray-700 dark:text-white">
              Nombre de commandes
            </span>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121] dark:bg-white">
          <ShoppingCart className="h-5 w-5 text-white dark:text-black" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-md dark:bg-[#25303F]">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-lg font-medium dark:text-white">
              {totalBenefits.toFixed(2)}€
            </h4>
            <span className="text-sm font-normal text-blue-gray-700 dark:text-white">
              Total des bénéfices
            </span>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121] dark:bg-white">
          <Euro className="h-5 w-5 text-white dark:text-black" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-md dark:bg-[#25303F]">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-lg font-medium dark:text-white">
              {courses.length}
            </h4>
            <span className="text-sm font-normal text-blue-gray-700 dark:text-white">
              Nombre de formations
            </span>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121] dark:bg-white">
          <ShoppingBag className="h-5 w-5 text-white dark:text-black" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-md dark:bg-[#25303F]">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-lg font-medium dark:text-white">
              {formattedNumber}
            </h4>
            <span className="text-sm font-normal text-blue-gray-700 dark:text-white">
              Nombre d'inscrits
            </span>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121] dark:bg-white">
          <Users2 className="h-5 w-5 text-white dark:text-black" />
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
