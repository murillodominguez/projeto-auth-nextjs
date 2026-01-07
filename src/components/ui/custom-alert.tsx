export function SuccessAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#3ac952] border-1 border-[#185e23] text-[#1e5c28] rounded-sm p-2 text-xs">
        {children}
    </div>
  )
}

export function ErrorAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#cf595f] border-1 border-[#331315] text-[#FFF] rounded-sm p-2 text-xs">
        {children}
    </div>
  )
}