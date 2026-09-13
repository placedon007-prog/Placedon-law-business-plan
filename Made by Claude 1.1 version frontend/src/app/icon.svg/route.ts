import { palette } from "@/lib/tokens";
export function GET() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="100" fill="${palette.ink}"/><path fill="${palette.cream}" d="M181 146h667L756 405H624V316q0-30-30-30H436q-30 0-30 30v89H274ZM274 487h132v143l109-69 109 69V487h132l92 260H406v150L181 747Z"/></svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
