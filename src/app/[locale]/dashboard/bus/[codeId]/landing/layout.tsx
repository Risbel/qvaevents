import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-full lg:max-w-4xl mx-auto my-4 px-4">{children}</main>;
};

export default LandingLayout;
