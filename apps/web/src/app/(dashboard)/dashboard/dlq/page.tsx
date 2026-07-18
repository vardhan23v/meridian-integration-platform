export default function DLQPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dead Letter Queue (DLQ)
        </h2>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="py-10 text-center text-gray-500">
          <p>Failed payload messages and resolution interface will be mounted here.</p>
          <p className="mt-2 text-sm">Connects to Kafka DLQ Topic</p>
        </div>
      </div>
    </div>
  );
}
