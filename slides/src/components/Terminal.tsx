import { TypeAnimation } from "react-type-animation";

interface Props {
  /** title text shown in window chrome */
  title?: string;
  /** lines to type. strings type at speed; numbers pause (ms) */
  sequence: (string | number)[];
  /** characters per second */
  speed?: number;
  className?: string;
}

export default function Terminal({
  title = "claude",
  sequence,
  speed = 60,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-lg overflow-hidden shadow-xl bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed w-full ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-black/40">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden="true"></span>
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden="true"></span>
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden="true"></span>
        <span className="ml-3 text-xs text-[#969696] select-none">{title}</span>
      </div>
      <pre className="p-4 m-0 whitespace-pre-wrap break-words min-h-[18rem] w-full max-w-full overflow-hidden">
        <TypeAnimation
          sequence={sequence}
          speed={speed as never}
          cursor={true}
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", display: "block", maxWidth: "100%" }}
        />
      </pre>
    </div>
  );
}
