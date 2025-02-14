import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import qs from "qs";
import cn from "classnames";

const CategoryItem = ({ label, value, icon }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Récupérer les paramètres actuels
  const currentCategoryId = searchParams.get("categoryId");

  // Vérifier si cet élément est sélectionné
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

    navigate(`/courses?${searchString}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex min-w-max items-center gap-x-2 rounded-md border px-2 py-2 text-sm font-medium transition hover:shadow-sm dark:text-white",
        {
          "border-blue-gray-800/10 bg-blue-gray-500/20 dark:bg-gray-100 dark:text-blue-gray-800":
            isSelected,
          "border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:text-black":
            !isSelected,
        },
      )}
      type="button"
    >
      {icon && <img src={icon} alt={label} className="h-6 w-6" />}
      <span className="truncate">{label}</span>
    </button>
  );
};

export default CategoryItem;
