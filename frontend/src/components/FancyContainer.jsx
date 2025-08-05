import { cn } from "@utils/cn";
export default function FancyContainer({ children, title, className=""}) {
  return (
    <div 
        className={cn(className, "max-w-4xl mx-auto rounded-3xl overflow-hidden relative")}
        style={{
          background: 'linear-gradient(145deg, #FFFAF0 0%, #FFF8DC 100%)',
          boxShadow: '0 20px 40px rgba(139, 0, 0, 0.3), 0 0 0 2px #FFD700'
        }}
      >
        {/* Top border decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-r from-[#ffd700] via-[#dc143c] to-[#ffd700]" />

        {/* Header */}
        <div 
          className="text-center p-8 text-yellow-400 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%)'
          }}
        >
          {/* Animated shimmer effect */}
          <div 
            className="absolute inset-0 opacity-30 animate-shimmer"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 215, 0, 0.1) 10px,
                rgba(255, 215, 0, 0.1) 20px
              )`,
            }}
          />
          
          <h1 className="text-4xl font-bold mb-2 relative z-10" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'}}>
            {title}
          </h1>
        </div>

        {/* Content */}
        {children}
        </div>

  )
}