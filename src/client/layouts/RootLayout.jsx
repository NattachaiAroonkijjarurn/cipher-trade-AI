import Sidebar from "./sidebar";

function RootLayout({ children }) {
  return (
    <div className="flex flex-auto">
      <Sidebar />
      <main className="flex-1 mx-1 py-1"> {/* Adjust margin-left here */}
        {children}
      </main>
    </div>
  );
}

export default RootLayout;