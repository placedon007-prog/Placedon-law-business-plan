# Web implementation decisions

- Preserve the existing Next.js 16 installation and local package changes; the brief's Next.js 15 reference does not justify a downgrade.
- Integrate a snapshot of the completed content pack under `src/lib/placedon-content`, preserving relative imports and the original pack.
- Use the actual transparent brand mark as a monochrome mask. Add the missing Inter font from the Google Fonts source, with its OFL licence, and self-host all fonts.
- Palette: ink `#0C0C0D`, cream `#F4EFE6`, warm grey `#6B665F`, pale rule `#D8D1C5`, brass `#C9A24B`; abstention `#5B6472` is a semantic state only.
- Composition: a large left-aligned Fraunces assertion beside a compact dark evidence record. Below, a reading sequence, an editorial witness panel, and audience rows. Avoid an identical card grid for every page.
- Header: brand and quiet navigation, with the single gold pilot action. In-page actions stay monochrome so a screen never needs two gold elements.
- The evidence record is the signature visual and the only entrance sequence. It contains an explicit conceptual abstention with missing evidence, not an invented statutory example.
- Structure sketch: `brand / navigation / pilot` above `assertion | evidence record`, followed by `method → evidence boundaries → intended audience → invitation`.
- Use native accessible controls where they meet the interaction requirements; do not add component dependencies solely for styling.
- Keep intake closed until an approved privacy notice, public origin, reviewed notice versions, and a real sink are configured. Preview fields remain visible for review but do not accept submissions.
- Keep legal templates visible as drafts, with unresolved business fields labelled rather than fabricated. Publication and live legal reliance are separate from this local build.
