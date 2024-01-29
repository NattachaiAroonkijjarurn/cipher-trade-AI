import Sidebar from "./sidebar";

function RootLayout({ children }) {
  return (
    <div className="flex flex-auto gap-5">
      <Sidebar />
      <main className="text-white  flex-1  mx-5 py-4">{children}</main>
    </div>
  );
}

export default RootLayout;
