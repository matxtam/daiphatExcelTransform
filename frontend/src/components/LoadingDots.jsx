import {cn} from "@utils/cn";
export default function LoadingDots({ className }) {
  return (
    <span className={cn("inline-flex items-center justify-center space-x-2", className)}>
      <div className="w-1 h-1 bg-black rounded-full animate-[bounce_1.5s_ease-in_infinite]"></div>
      <div className="w-1 h-1 bg-black rounded-full animate-[bounce_1.5s_ease-in_0.1s_infinite]"></div>
      <div className="w-1 h-1 bg-black rounded-full animate-[bounce_1.5s_ease-in_0.2s_infinite]"></div>
    </span>
  );
}