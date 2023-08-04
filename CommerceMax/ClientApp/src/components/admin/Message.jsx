import React from "react";

const Message = ({ title, description, image }) => {
  return (
    <div
      className="max-w-md mx-auto

    bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-8"
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover  md:w-[140px] img"
            src={image}
            alt="Imagen del mensaje"
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {title}
          </div>
          <a
            href="#"
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {description}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Message;
