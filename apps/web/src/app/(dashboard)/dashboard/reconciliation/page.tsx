export default function ReconciliationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Reconciliation Engine
        </h2>
        <button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Run Manual Recon
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="py-10 text-center text-gray-500">
          <p>Reconciliation variance reports and audit logs will be mounted here.</p>
          <p className="mt-2 text-sm">Connects to /api/v1/reconciliations</p>
        </div>
      </div>
    </div>
  );
}
