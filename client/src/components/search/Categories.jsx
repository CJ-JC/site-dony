import React from "react";
import CategoryItem from "./CategoryItem";

const Categories = ({ items }) => {
  // Map des icônes associées aux catégories
  const iconMap = {
    Piano: "/img/piano.svg",
    Guitare: "/img/guitare.svg",
    Batterie: "/img/batterie.svg",
    Basse: "/img/basse.svg",
    Chant: "/img/mic.svg",
  };

  const colorMap = {
    Piano: "#DC143D",
    Guitare: "#023047",
    Batterie: "#2D6A50",
    Basse: "#FF7703",
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
