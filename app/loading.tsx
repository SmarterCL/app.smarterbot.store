export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-[#FFE135]/20 border-t-[#FFE135] rounded-full animate-spin mb-4" />
        <p className="text-[#FFE135] font-bold">Loading Nano Banana...</p>
      </div>
    </div>
  )
}
