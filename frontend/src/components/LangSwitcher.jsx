import { cn } from "@utils/cn";
import vn from "@assets/vietnam.png";
import zh from "@assets/taiwan.png";
export default function LangSwitcher({ lang, setLang, className=""}) {
  return (
    <div className={cn("flex items-center  z-20 rounded-full bg-[#FFF8DC]", className)}>
      <button
        className={cn("p-2 rounded-l-full transition-all duration-200", (lang == "vn" && "bg-yellow-400"))}
        onClick={() => setLang("vn")}
      >
        <img src={vn} width="30"/> 
      </button>

      <button
        className={cn("p-2 rounded-r-full transition-all duration-200", (lang == "zh" && "bg-yellow-400"))}
        onClick={() => setLang("zh")}
      >
        <img src={zh} width="30"/> 
      </button>
    </div>
  );
}