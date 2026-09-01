type AuthCardProps = {
  children: React.ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
      {children}
    </div>
  );
}