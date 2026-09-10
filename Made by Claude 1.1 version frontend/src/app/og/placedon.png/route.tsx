import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { palette } from "@/lib/tokens";
export const runtime = "nodejs";
export async function GET() {
  const [font, mono, logo] = await Promise.all([
    readFile(join(process.cwd(), "brand-kit/fonts/Fraunces-OG-Regular.ttf")),
    readFile(join(process.cwd(), "brand-kit/fonts/IBMPlexMono-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/placedon-white.png")),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: palette.cream,
          color: palette.ink,
          padding: 72,
          flexDirection: "column",
          fontFamily: "Fraunces",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 42,
            }}
          >
            <div
              style={{ display: "flex", background: palette.ink, padding: 10 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${logo.toString("base64")}`}
                width={24}
                height={28}
                alt=""
              />
            </div>
            Placedon
          </div>
          <span style={{ fontFamily: "Mono", fontSize: 20 }}>Pre-launch</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            letterSpacing: -3,
            lineHeight: 1.1,
            marginTop: 75,
            maxWidth: 900,
          }}
        >
          An answer must carry its authority.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontFamily: "Mono",
            fontSize: 24,
          }}
        >
          Provision. Instrument. Operative date.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontFamily: "Mono",
            fontSize: 18,
          }}
        >
          Indian corporate law
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Fraunces", data: font, weight: 400 },
        { name: "Mono", data: mono, weight: 400 },
      ],
    },
  );
}
