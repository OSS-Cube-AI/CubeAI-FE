import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="font-bold text-2xl text-center">This is the header</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
