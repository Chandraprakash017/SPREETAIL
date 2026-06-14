import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-8">
        <h1 className="text-xl font-bold text-gray-800">Shared Expense</h1>
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Shared Expense App
      </footer>
    </div>
  );
};

export default MainLayout;
