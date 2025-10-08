import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import GoBackButton from "@/app/components/GoBackButton";
import ClientsUserDropdown from "@/app/components/ClientsUserDropdown";

const MeLayout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) => {
  return (
    <>
      <nav className="flex justify-between items-center fixed w-full px-2 py-2 md:px-4 border-b z-50 bg-background/20 shadow-sm backdrop-blur-sm">
        <GoBackButton />
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
          <ClientsUserDropdown />
        </div>
      </nav>

      <div className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl py-24 px-4">{children}</div>
    </>
  );
};

export default MeLayout;
