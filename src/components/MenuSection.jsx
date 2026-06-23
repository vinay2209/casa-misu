// MenuSection.jsx
import React from "react";
import tiramisu from "../assets/tiramisu-maroon.svg";
import cookie from "../assets/cookie-maroon.svg";
import cake from "../assets/cake-maroon.svg";
import gift from "../assets/gift-maroon.svg";

const menu = [
  {
    name: "Tiramisu",
    desc: "Classic, Pistachio, Seasonal & more.",
    icon: tiramisu
  },
  {
    name: "Cookies",
    desc: "Soft, chewy & baked to perfection.",
    icon: cookie
  },
  {
    name: "Desserts",
    desc: "Delightful treats to brighten your day.",
    icon: cake
  },
  {
    name: "Gifting",
    desc: "Perfect for every special occasion.",
    icon: gift
  }
];

export default function MenuSection() {
  return (
    <section className="section w-full flex flex-col items-center">
      <h2 className="heading-2 mb-2 text-center">OUR MENU</h2>
      <div className="text-lg text-gray-500 mb-10 text-center font-cormorant">Something sweet for every craving</div>
      <div className="flex flex-wrap gap-12 justify-center w-full max-w-5xl">
        {menu.map((item, i) => (
          <div key={i} className="bg-[#FCF8F3] rounded-[2.5rem] border-2 border-[#1149A6] shadow-lg w-64 flex flex-col items-center py-12 px-4 relative">
            <img src={item.icon} alt={item.name} className="h-20 mb-6" />
            <div className="font-playfair text-[#1149A6] text-xl mb-2">{item.name}</div>
            <div className="text-gray-600 text-base mb-6 text-center font-inter">{item.desc}</div>
            <button className="rounded-full border border-[#1149A6] text-[#1149A6] px-6 py-2 font-medium hover:bg-[#1149A6] hover:text-white transition">View Menu</button>
          </div>
        ))}
      </div>
    </section>
  );
}
