"use client";

interface StateViewProps {
  title?: string;
  subtitle?: string;
  message: string;
  type?: "error" | "empty";
}

export default function StateView({ 
  title = "Python by PyLearn", 
  subtitle = "Expert guides, study strategies, and programming tutorials to help you excel in CBSE Class 12 Computer Science",
  message,
  type = "error"
}: StateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-text mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-text-secondary mb-16 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-text-secondary font-medium text-lg">
              {message}
            </p>
            {type === "error" && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 text-primary font-bold hover:underline cursor-pointer flex items-center gap-2 mx-auto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 7M21 3v4h-4" />
                </svg>
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
