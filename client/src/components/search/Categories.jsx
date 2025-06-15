import React from "react";
import CategoryItem from "./CategoryItem";

const Categories = ({ items }) => {
  // Map des icônes associées aux catégories
  const iconMap = {
    Basse: "/img/basse.svg",
    Batterie: "/img/batterie.svg",
    Chant: "/img/mic.svg",
    Guitare: "/img/guitare.svg",
    Piano: "/img/piano.svg",
  };

  const colorMap = {
    Basse: "#FF7703",
    Batterie: "#2D6A50",
    Guitare: "#023047",
    Piano: "#DC143D",
    Chant: "#000000",
  };

  return (
    <div className="flex items-center gap-x-4 overflow-x-auto lg:justify-center">
      {items.map((item) => (
        <CategoryItem
          icon={iconMap[item.name]}
          key={item.id}
          value={item.id}
          label={item.name}
          color={colorMap[item.name]}
        />
      ))}
    </div>
  );
};

export default Categories;
