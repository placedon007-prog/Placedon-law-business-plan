import type { ReactNode } from "react";
import { LegalText } from "./brand";

function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\s)]+\))/g)
    .map((part, index) => {
      if (part.startsWith("**"))
        return <strong key={index}>{inline(part.slice(2, -2))}</strong>;
      if (part.startsWith("`"))
        return <code key={index}>{part.slice(1, -1)}</code>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = /^(https:\/\/|\/)/.test(link[2]) ? link[2] : "#";
        return (
          <a
            key={index}
            href={href}
            rel={href.startsWith("https:") ? "noreferrer" : undefined}
          >
            {link[1]}
          </a>
        );
      }
      return <LegalText key={index}>{part}</LegalText>;
    });
}
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
/** Deliberately limited Markdown renderer; never interprets raw HTML. */
export function LegalDocument({ source }: { source: string }) {
  const blocks = source.split(/\n\s*\n/);
  return (
    <article className="legal-body">
      {blocks.map((block, index) => {
        if (block.startsWith("# ")) return null;
        if (block.startsWith("## ")) {
          const title = block.slice(3);
          return (
            <h2 id={headingId(title)} key={index}>
              {title}
            </h2>
          );
        }
        if (block.startsWith("### "))
          return <h3 key={index}>{block.slice(4)}</h3>;
        if (block.startsWith("```")) return null;
        if (block.startsWith("|")) {
          const rows = block
            .split("\n")
            .filter((row) => !/^\|[\s:|-]+\|$/.test(row))
            .map((row) =>
              row
                .split("|")
                .slice(1, -1)
                .map((cell) => cell.trim()),
            );
          return (
            <div
              className="legal-table-wrap"
              key={index}
              tabIndex={0}
              role="region"
              aria-label="Policy details table"
            >
              <table>
                <thead>
                  <tr>
                    {rows[0].map((cell, i) => (
                      <th key={i} scope="col">
                        {inline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{inline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.startsWith("- "))
          return (
            <ul key={index}>
              {block.split("\n").map((line, i) => (
                <li key={i}>{inline(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        return (
          <p key={index}>
            {inline(block.replace(/  \n/g, "\n")).map((part, i) => (
              <span key={i}>{part}</span>
            ))}
          </p>
        );
      })}
    </article>
  );
}
