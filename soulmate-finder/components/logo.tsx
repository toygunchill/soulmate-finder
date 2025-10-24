interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  const sizes = {
    sm: { container: "h-10 w-10", text: "text-lg" },
    md: { container: "h-16 w-16", text: "text-2xl" },
    lg: { container: "h-20 w-20", text: "text-3xl" },
  }

  const sizeClasses = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses.container} relative flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* Main heart shape */}
          <path
            d="M50 85C50 85 15 60 15 35C15 25 22 18 30 18C37 18 43 23 50 30C57 23 63 18 70 18C78 18 85 25 85 35C85 60 50 85 50 85Z"
            fill="url(#heartGradient)"
            className="drop-shadow-lg"
          />

          {/* Sparkle 1 - top left */}
          <path
            d="M25 25L27 30L32 28L28 33L30 38L25 35L20 38L22 33L18 28L23 30L25 25Z"
            fill="url(#sparkleGradient)"
            className="animate-pulse"
            style={{ animationDelay: "0s", animationDuration: "2s" }}
          />

          {/* Sparkle 2 - top right */}
          <path
            d="M75 25L77 30L82 28L78 33L80 38L75 35L70 38L72 33L68 28L73 30L75 25Z"
            fill="url(#sparkleGradient)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "2s" }}
          />

          {/* Sparkle 3 - center */}
          <path
            d="M50 45L51.5 48.5L55 47L52 51L53.5 54.5L50 52L46.5 54.5L48 51L45 47L48.5 48.5L50 45Z"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "2s" }}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${sizeClasses.text} font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight`}
          >
            WIYS
          </span>
          <span className="text-xs text-muted-foreground leading-tight">Find Your Soulmate</span>
        </div>
      )}
    </div>
  )
}
