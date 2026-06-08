"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "python" }: CodeBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Highlight
      theme={isDark ? themes.nightOwl : themes.github}
      code={code.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 rounded-xl overflow-x-auto text-sm`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
