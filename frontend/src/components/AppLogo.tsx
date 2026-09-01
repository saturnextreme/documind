type AppLogoProps = {
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: {
    container: "h-8 w-8 rounded-lg",
    icon: "h-4 w-4",
  },
  md: {
    container: "h-9 w-9 rounded-xl",
    icon: "h-5 w-5",
  },
  lg: {
    container: "h-12 w-12 rounded-2xl",
    icon: "h-6 w-6",
  },
};

export default function AppLogo({ size = "md" }: AppLogoProps) {
  const style = sizes[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-violet-600 to-blue-600 ${style.container}`}
    >
      <svg
        className={`text-white ${style.icon}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3.5V8h4"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 12h4M10 15h4"
        />
      </svg>
    </div>
  );
}