import NavbarOrg from "./[codeId]/components/NavbarOrg";

const OrgLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <NavbarOrg />
      <main className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl px-4">{children}</main>
    </div>
  );
};

export default OrgLayout;
