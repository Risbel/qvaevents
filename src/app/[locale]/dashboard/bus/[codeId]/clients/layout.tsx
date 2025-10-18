import React from "react";

const ClientsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-4 py-4">{children}</div>;
};

export default ClientsLayout;
