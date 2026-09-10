import { systemContent } from "@/lib/placedon-content/content/system";
import Link from "next/link";
export default function NotFound() {
  const copy = systemContent.notFound;
  return (
    <div className="container system-page">
      <span className="eyebrow mono">404 / Page not found</span>
      <h1>{copy.headline}</h1>
      <p>{copy.subhead}</p>
      <Link href="/" className="button">
        Return home
      </Link>
    </div>
  );
}
