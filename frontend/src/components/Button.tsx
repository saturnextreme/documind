type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  children,
  loading = false,
  loadingText = "Loading...",
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {loadingText}
        </>
      ) : (
        <>
          {children}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </>
      )}
    </button>
  );
}