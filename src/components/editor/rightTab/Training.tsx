interface TrainingProps {
  logs: string[];
}

export default function Training({ logs }: TrainingProps) {
  return (
    <div className="py-5 rounded-lg shadow-md w-full h-full">
      <h2 className="mb-4 text-xl font-bold text-gray-800">학습 터미널 로그</h2>
      <div className="bg-gray-900 text-gray-200 text-sm p-4 rounded-lg overflow-y-auto h-full font-mono font-normal">
        {logs.map((log, index) => (
          <div key={index} className="log-entry text-left">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
