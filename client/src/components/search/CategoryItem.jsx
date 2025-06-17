import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import qs from "qs";
import cn from "classnames";

const CategoryItem = ({ label, value, icon, color }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategoryId = searchParams.get("categoryId");
  const isSelected = currentCategoryId === value;

  const handleClick = () => {
    const currentParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    const updatedParams = {
      ...currentParams,
      categoryId: isSelected ? undefined : value,
    };

    const searchString = qs.stringify(updatedParams, {
      skipNulls: true,
      skipEmptyStrings: true,
    });

    // Redirige dynamiquement vers la page actuelle avec la nouvelle query
    navigate(`${location.pathname}?${searchString}`);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isSelected ? color : "#D1D5DB";
      }}
      className={cn(
        "flex min-w-max items-center gap-x-2 rounded-md border px-2 py-2 text-sm font-medium transition hover:shadow-sm dark:text-white",
        {
          "border-blue-gray-800/10 bg-blue-gray-500/20 dark:bg-gray-100 dark:text-gray-800":
            isSelected,
          "border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:text-black":
            !isSelected,
        },
      )}
      type="button"
    >
      {icon && <img src={icon} alt="" aria-hidden="true" className="h-6 w-6" />}
      <span className="truncate">{label}</span>
    </button>
  );
};

export default CategoryItem;
