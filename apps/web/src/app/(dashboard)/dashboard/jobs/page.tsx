export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Integration Jobs
        </h2>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Trigger Extraction
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="py-10 text-center text-gray-500">
          <p>Integration jobs data table will be mounted here.</p>
          <p className="mt-2 text-sm">Connects to /api/v1/integrations</p>
        </div>
      </div>
    </div>
  );
}
