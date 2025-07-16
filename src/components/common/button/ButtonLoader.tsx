export default function ButtonLoader() {
  return (
    <div className="flex items-center gap-1">
      <div
        className="size-2 bg-white rounded-full shadow-md animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '0.8s' }}
      />
      <div
        className="size-2 bg-white rounded-full shadow-md animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '0.8s' }}
      />
      <div
        className="size-2 bg-white rounded-full shadow-md animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '0.8s' }}
      />
    </div>
  );
}
