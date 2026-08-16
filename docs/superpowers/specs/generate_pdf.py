"""Generate a PDF of the brand philosophy spec using reportlab."""
import re
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

INK       = HexColor("#0A0A0A")
PARCHMENT = HexColor("#F5F3EF")
SLATE     = HexColor("#475569")
SLATE80   = HexColor("#334155")
INK40     = HexColor("#B5B5B5")
INK10     = HexColor("#E8E6E2")
WHITE     = HexColor("#FFFFFF")

MD_PATH  = Path(__file__).parent / "2026-08-16-brand-philosophy-design.md"
PDF_PATH = Path(__file__).parent / "Placedon-Brand-Philosophy.pdf"

def make_styles():
    base = getSampleStyleSheet()

    def ps(name, **kw):
        return ParagraphStyle(name, **kw)

    cover_title = ps("CoverTitle",
        fontName="Times-Bold", fontSize=28, leading=34,
        textColor=PARCHMENT, alignment=TA_LEFT, spaceAfter=8)

    cover_sub = ps("CoverSub",
        fontName="Helvetica", fontSize=12, leading=18,
        textColor=INK40, alignment=TA_LEFT)

    h1 = ps("H1",
        fontName="Times-Bold", fontSize=18, leading=24,
        textColor=INK, spaceBefore=18, spaceAfter=6)

    h2 = ps("H2",
        fontName="Times-Bold", fontSize=13, leading=18,
        textColor=INK, spaceBefore=14, spaceAfter=4)

    h3 = ps("H3",
        fontName="Helvetica-Bold", fontSize=10, leading=14,
        textColor=SLATE80, spaceBefore=10, spaceAfter=3)

    body = ps("Body",
        fontName="Helvetica", fontSize=9.5, leading=15,
        textColor=INK, spaceBefore=0, spaceAfter=6)

    quote = ps("Quote",
        fontName="Times-Italic", fontSize=11, leading=16,
        textColor=SLATE80, leftIndent=18, spaceBefore=8, spaceAfter=8)

    label = ps("Label",
        fontName="Helvetica", fontSize=8, leading=11,
        textColor=INK40, spaceBefore=0, spaceAfter=2)

    bullet = ps("Bullet",
        fontName="Helvetica", fontSize=9.5, leading=14,
        textColor=INK, leftIndent=14, spaceBefore=1, spaceAfter=1)

    table_hdr = ps("TableHdr",
        fontName="Helvetica-Bold", fontSize=8.5, leading=12,
        textColor=WHITE)

    table_cell = ps("TableCell",
        fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=INK)

    table_cell_it = ps("TableCellIt",
        fontName="Helvetica-Oblique", fontSize=8.5, leading=12,
        textColor=INK40)

    return dict(
        cover_title=cover_title, cover_sub=cover_sub,
        h1=h1, h2=h2, h3=h3, body=body, quote=quote,
        label=label, bullet=bullet,
        table_hdr=table_hdr, table_cell=table_cell, table_cell_it=table_cell_it
    )

def table_style(col_widths):
    return TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  SLATE80),
        ("TEXTCOLOR",     (0, 0), (-1, 0),  WHITE),
        ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 8.5),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [PARCHMENT, WHITE]),
        ("GRID",          (0, 0), (-1, -1), 0.4, INK10),
        ("LEFTPADDING",   (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ])

def parse_and_build(md_text, styles):
    W = 19 * cm  # usable width inside 2cm margins
    story = []

    # Cover block
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=SLATE))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph("Placedon", styles["cover_title"]))
    story.append(Paragraph("Brand Philosophy &amp; Content Direction", styles["cover_sub"]))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Spec date: 2026-08-16 · Derived from five-agent council review", styles["label"]))
    story.append(Spacer(1, 0.4*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=SLATE))
    story.append(Spacer(1, 0.8*cm))

    lines = md_text.split("\n")
    i = 0

    def inline(text):
        """Convert inline markdown (bold, italic, code, em-dashes) to reportlab markup."""
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
        text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
        text = re.sub(r"`(.+?)`", r"<font name='Courier' color='#475569'>\1</font>", text)
        return text

    while i < len(lines):
        line = lines[i]

        # Skip the doc-level H1 (cover already has it)
        if line.startswith("# "):
            i += 1
            continue

        # H2 sections
        if line.startswith("## "):
            text = line[3:].strip()
            # strip leading number like "1. "
            text = re.sub(r"^\d+\.\s+", "", text)
            story.append(HRFlowable(width="100%", thickness=0.5, color=INK10))
            story.append(Paragraph(inline(text), styles["h1"]))
            i += 1
            continue

        # H3
        if line.startswith("### "):
            text = line[4:].strip()
            story.append(Paragraph(inline(text), styles["h2"]))
            i += 1
            continue

        # Blockquote
        if line.startswith("> "):
            text = line[2:].strip()
            story.append(Paragraph(inline(text), styles["quote"]))
            i += 1
            continue

        # Table
        if line.startswith("|"):
            rows_raw = []
            while i < len(lines) and lines[i].startswith("|"):
                if not re.match(r"^\|[-| :]+\|$", lines[i].strip()):
                    cells = [c.strip() for c in lines[i].split("|")[1:-1]]
                    rows_raw.append(cells)
                i += 1

            if not rows_raw:
                continue

            ncols = len(rows_raw[0])
            col_w = [W / ncols] * ncols

            # Heuristic: last column wider if 3-col table
            if ncols == 3:
                col_w = [W * 0.28, W * 0.2, W * 0.52]
            elif ncols == 2:
                col_w = [W * 0.35, W * 0.65]

            table_data = []
            for ridx, row in enumerate(rows_raw):
                s = styles["table_hdr"] if ridx == 0 else styles["table_cell"]
                table_data.append([Paragraph(inline(c), s) for c in row])

            t = Table(table_data, colWidths=col_w)
            t.setStyle(table_style(col_w))
            story.append(Spacer(1, 0.2*cm))
            story.append(t)
            story.append(Spacer(1, 0.3*cm))
            continue

        # Bullet
        if re.match(r"^[-*] ", line):
            text = re.sub(r"^[-*] ", "", line).strip()
            story.append(Paragraph("&#8226;  " + inline(text), styles["bullet"]))
            i += 1
            continue

        # Numbered list
        if re.match(r"^\d+\. ", line):
            text = re.sub(r"^\d+\. ", "", line).strip()
            story.append(Paragraph(inline(text), styles["bullet"]))
            i += 1
            continue

        # Horizontal rule
        if re.match(r"^-{3,}$", line) or re.match(r"^\*{3,}$", line):
            story.append(Spacer(1, 0.2*cm))
            story.append(HRFlowable(width="100%", thickness=0.5, color=INK10))
            story.append(Spacer(1, 0.2*cm))
            i += 1
            continue

        # Spec metadata line (bold key: value at top)
        if line.startswith("**Spec date:**") or line.startswith("**Derived from:**"):
            story.append(Paragraph(inline(line), styles["label"]))
            i += 1
            continue

        # Regular paragraph (skip blank lines)
        stripped = line.strip()
        if stripped:
            story.append(Paragraph(inline(stripped), styles["body"]))
        else:
            story.append(Spacer(1, 0.15*cm))

        i += 1

    return story

def build():
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
        title="Placedon — Brand Philosophy & Content Direction",
        author="Placedon",
    )

    styles = make_styles()
    md_text = MD_PATH.read_text()
    story = parse_and_build(md_text, styles)

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(INK40)
        canvas.drawString(2*cm, 1.2*cm, "Placedon — Brand Philosophy & Content Direction")
        canvas.drawRightString(19*cm + 2*cm, 1.2*cm, f"Page {doc.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"PDF written to: {PDF_PATH}")

if __name__ == "__main__":
    build()
