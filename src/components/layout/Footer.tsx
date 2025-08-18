export default function Footer() {
  return (
    <footer className="border-t bg-white/50">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-zinc-500">
        © {new Date().getFullYear()} Cube AI
      </div>
    </footer>
  );
}
