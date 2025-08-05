import { cn } from "@utils/cn";
export default function FancyButton({ children, onClick, type="right", className=""}) {
  return (
    <button
      className={cn( 
        " px-4 py-2 rounded-full font-bold border-2 transition-all duration-300 ",
       ((type === "right") ? "bg-linear-135 from-[#DC143C] to-[#8B0000] text-[#FFD700] border-[#FFD700] hover:bg-gradient-to-135 hover:from-[#FFD700] hover:to-[#DC143C] hover:text-[#8B0000] hover:border-[#8B0000]"
       : "bg-linear-135 from-[#8B0000] via-[#DC143C] to-[#B22222] text-[#FFD700] shadow-[0_6px_20px_rgba(255,215,0,0.4)] translate-y-[-2px] group-hover:bg-gradient-to-135 group-hover:from=[#A0522D] group-hover:via-[#FFD700] group-hover:to-[#DC143C] group-hover:text-[#8B0000] group-hover:shadow-[0_4px_15px_rgba(220,20,60,0.3)] group-hover:translate-y-0"),
       className
      )}
      onClick={onClick}
      >
      {children}
    </button>
  );
}