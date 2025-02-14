import React from "react";
import CategoryItem from "./CategoryItem";

const Categories = ({ items }) => {
  // Map des icônes associées aux catégories
  const iconMap = {
    Basse: "/img/basse.svg",
    Batterie: "/img/batterie.svg",
    Guitare: "/img/guitare.svg",
    Piano: "/img/piano.svg",
  };

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto lg:justify-center">
      {items.map((item) => (
        <CategoryItem
          icon={iconMap[item.name]}
          key={item.id}
          value={item.id}
          label={item.name}
        />
      ))}
    </div>
  );
};

export default Categories;
