import os
import sys
import time
from playwright.sync_api import sync_playwright
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from PIL import Image

SCREENSHOTS_DIR = os.path.abspath("screenshots")
OUTPUT_PDF = os.path.abspath("GEO_Platform_UI_Screenshots.pdf")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

print("Starting browser for screenshot capture...")

slides_data = [
    {
        "id": "01_landing_hero",
        "tag": "MARKETING SUITE // HERO",
        "title": "Brand Perceptual Telemetry & Live Vector Synthesizer",
        "subtitle": "Landing Page: Real-time prompt vector synthesis and generative engine scoring console",
        "action": lambda page: page.goto("http://localhost:5173/") or page.wait_for_timeout(1000)
    },
    {
        "id": "02_landing_forensic",
        "tag": "MARKETING SUITE // DIMENSION 01",
        "title": "Forensic Extraction Engine & Retrieval Vectors",
        "subtitle": "Reverse-engineering LLM latent vectors, citation grounding, and brand provenance",
        "action": lambda page: (
            page.goto("http://localhost:5173/"),
            page.wait_for_timeout(500),
            page.locator("#forensic-extraction").scroll_into_view_if_needed(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "03_landing_framework",
        "tag": "MARKETING SUITE // DIMENSION 02",
        "title": "Framework Architecture: Five Dimensions of Brand Equity",
        "subtitle": "Multi-dimensional methodology covering AI Visibility, Win Rate, Accuracy, Authority, and Impact",
        "action": lambda page: (
            page.goto("http://localhost:5173/"),
            page.wait_for_timeout(500),
            page.locator("#framework-architecture").scroll_into_view_if_needed(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "04_landing_research",
        "tag": "MARKETING SUITE // DIMENSION 04",
        "title": "Institutional Research & Peer-Reviewed Telemetry",
        "subtitle": "Academic benchmarks on generative engine optimization, citations, and neural RAG",
        "action": lambda page: (
            page.goto("http://localhost:5173/"),
            page.wait_for_timeout(500),
            page.locator("#institutional-research").scroll_into_view_if_needed(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "05_landing_faq",
        "tag": "MARKETING SUITE // DIMENSION 05",
        "title": "Technical Architecture FAQ & Telemetry Ingestion",
        "subtitle": "Technical FAQs on SearchGPT web indexing bot frequency and crawl telemetry",
        "action": lambda page: (
            page.goto("http://localhost:5173/"),
            page.wait_for_timeout(500),
            page.locator("#technical-faq").scroll_into_view_if_needed(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "06_modal_audit",
        "tag": "INTERACTIVE OVERLAY // AUDIT",
        "title": "Executive GEO Audit Request Modal",
        "subtitle": "Full-screen dialog to initiate synthetic Monte Carlo prompt sweeps across ChatGPT",
        "action": lambda page: (
            page.goto("http://localhost:5173/?modal=audit"),
            page.wait_for_timeout(800)
        )
    },
    {
        "id": "07_modal_briefing",
        "tag": "INTERACTIVE OVERLAY // BRIEFING",
        "title": "Confidential Technical Briefing Modal",
        "subtitle": "Consultation booking dialog for enterprise search architecture and marketing leadership",
        "action": lambda page: (
            page.goto("http://localhost:5173/?modal=briefing"),
            page.wait_for_timeout(800)
        )
    },
    {
        "id": "08_modal_login",
        "tag": "INTERACTIVE OVERLAY // AUTH",
        "title": "Telemetry Vault Authentication Portal",
        "subtitle": "Secure authentication portal for enterprise workspace administrators and analysts",
        "action": lambda page: (
            page.goto("http://localhost:5173/?modal=login"),
            page.wait_for_timeout(800)
        )
    },
    {
        "id": "09_dash_visibility",
        "tag": "DASHBOARD // TAB 01",
        "title": "AI Visibility & 90-Day Trend Velocity",
        "subtitle": "Real-time mention rates, recommendation rate curves, and prompt universe audit table",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=visibility"),
            page.wait_for_timeout(1000)
        )
    },
    {
        "id": "10_modal_trace",
        "tag": "DASHBOARD // INSPECT TRACE",
        "title": "Prompt Universe Output Trace Modal",
        "subtitle": "Inspecting specific prompt vector responses, placement rankings, and attribution snippets",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=visibility"),
            page.wait_for_timeout(1000),
            page.locator("button:has-text('Inspect Trace')").first.click(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "11_dash_competitive",
        "tag": "DASHBOARD // TAB 02",
        "title": "Competitive Position & Share of Voice (SOV)",
        "subtitle": "Head-to-head win rate benchmarks, citation counts, and competitor entity analysis",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=competitive"),
            page.wait_for_timeout(1000)
        )
    },
    {
        "id": "12_dash_accuracy",
        "tag": "DASHBOARD // TAB 03",
        "title": "AI Accuracy, Trust & Ground Truth Verification",
        "subtitle": "Hallucination triage queue, verified ground truth matrix, and pricing/compliance audit",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=accuracy"),
            page.wait_for_timeout(1000)
        )
    },
    {
        "id": "13_modal_schema",
        "tag": "DASHBOARD // REMEDIATION",
        "title": "JSON-LD Schema Remediation Modal",
        "subtitle": "Automated structured data payload generator to eliminate LLM pricing hallucinations",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=accuracy"),
            page.wait_for_timeout(1000),
            page.locator("button:has-text('View Schema Fix')").first.click(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "14_dash_sources",
        "tag": "DASHBOARD // TAB 04",
        "title": "Sources & Authority Explorer",
        "subtitle": "Source diversity breakdown, freshness decay, competitor authority gap, and indexed URLs",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=sources"),
            page.wait_for_timeout(1000)
        )
    },
    {
        "id": "15_modal_outreach",
        "tag": "DASHBOARD // OUTREACH BRIEF",
        "title": "Synthesized Gap Outreach Brief Modal",
        "subtitle": "AI-generated editorial and PR outreach pitches to capture missing authoritative citations",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=sources"),
            page.wait_for_timeout(1000),
            page.locator("button:has-text('Generate Outreach Brief')").first.click(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "16_dash_opportunities",
        "tag": "DASHBOARD // TAB 05",
        "title": "Opportunities & Financial Impact Simulation",
        "subtitle": "Annualized ARR projection models, high-ROI action matrix, and opportunity priority backlog",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=opportunities"),
            page.wait_for_timeout(1000)
        )
    },
    {
        "id": "17_modal_simulation",
        "tag": "DASHBOARD // IMPACT SIMULATION",
        "title": "Action Lift Simulation Modal",
        "subtitle": "Pre-execution projected citation lift, implementation effort, and ROI metrics",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&tab=opportunities"),
            page.wait_for_timeout(1000),
            page.locator("button:has-text('Simulate Impact')").first.click(),
            page.wait_for_timeout(600)
        )
    },
    {
        "id": "18_modal_settings",
        "tag": "DASHBOARD // SETTINGS",
        "title": "Account & Workspace Settings Modal",
        "subtitle": "Enterprise team management, Pro plan subscription, and live API key management",
        "action": lambda page: (
            page.goto("http://localhost:5173/?view=dashboard&modal=settings"),
            page.wait_for_timeout(1000)
        )
    }
]

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe", headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=2)

    for i, slide in enumerate(slides_data, 1):
        print(f"[{i}/{len(slides_data)}] Capturing {slide['title']}...")
        img_path = os.path.join(SCREENSHOTS_DIR, f"{slide['id']}.png")
        try:
            slide["action"](page)
            page.screenshot(path=img_path)
            slide["img_path"] = img_path
            print(f" -> Saved: {os.path.basename(img_path)} ({os.path.getsize(img_path)} bytes)")
        except Exception as e:
            print(f" -> Error capturing {slide['id']}: {e}")
            slide["img_path"] = None

    browser.close()

print("\nAll screenshots captured. Assembling ReportLab PDF Dossier...")

# PDF Generation with ReportLab
page_width, page_height = landscape(A4)
c = canvas.Canvas(OUTPUT_PDF, pagesize=landscape(A4))

# Color palette
BG_DARK = colors.HexColor("#06080d")
BG_CARD = colors.HexColor("#0a0f18")
BORDER_ACCENT = colors.HexColor("#10b981")
TEXT_WHITE = colors.HexColor("#ffffff")
TEXT_MUTED = colors.HexColor("#94a3b8")
TEXT_EMERALD = colors.HexColor("#34d399")
TEXT_CYAN = colors.HexColor("#38bdf8")

# 1. COVER PAGE
c.setFillColor(BG_DARK)
c.rect(0, 0, page_width, page_height, fill=1, stroke=0)

# Subtle background decorative grid / lines
c.setStrokeColor(colors.HexColor("#1e293b"))
c.setLineWidth(0.5)
for x in range(0, int(page_width), 80):
    c.line(x, 0, x, page_height)
for y in range(0, int(page_height), 80):
    c.line(0, y, page_width, y)

# Decorative card in center
card_w = page_width - 120
card_h = page_height - 120
c.setFillColor(BG_CARD)
c.setStrokeColor(colors.HexColor("#10b98144"))
c.setLineWidth(1.5)
c.roundRect(60, 60, card_w, card_h, 16, fill=1, stroke=1)

# Badge
c.setFillColor(colors.HexColor("#064e3b"))
c.setStrokeColor(colors.HexColor("#10b98188"))
c.setLineWidth(1)
c.roundRect(100, page_height - 130, 260, 24, 6, fill=1, stroke=1)

c.setFont("Helvetica-Bold", 10)
c.setFillColor(TEXT_EMERALD)
c.drawString(112, page_height - 123, "GEO PLATFORM // EXECUTIVE UI DOSSIER")

# Title
c.setFont("Helvetica-Bold", 32)
c.setFillColor(TEXT_WHITE)
c.drawString(100, page_height - 180, "Complete UI Architecture & Design System")

# Subtitle
c.setFont("Helvetica", 14)
c.setFillColor(TEXT_MUTED)
c.drawString(100, page_height - 210, "High-Fidelity Telemetry, Ground Truth Audits & Generative Engine Optimization")

# Horizontal rule
c.setStrokeColor(colors.HexColor("#334155"))
c.setLineWidth(1)
c.line(100, page_height - 235, page_width - 100, page_height - 235)

# Metadata highlights
c.setFont("Helvetica-Bold", 11)
c.setFillColor(TEXT_CYAN)
c.drawString(100, page_height - 265, "TARGET PLATFORM:")
c.setFont("Helvetica", 11)
c.setFillColor(TEXT_WHITE)
c.drawString(240, page_height - 265, "OpenAI ChatGPT & SearchGPT Unified Telemetry")

c.setFont("Helvetica-Bold", 11)
c.setFillColor(TEXT_CYAN)
c.drawString(100, page_height - 290, "SCREEN RESOLUTION:")
c.setFont("Helvetica", 11)
c.setFillColor(TEXT_WHITE)
c.drawString(240, page_height - 290, "Retina Ultra-HD (3200 x 2000 px @ 2x DPR)")

c.setFont("Helvetica-Bold", 11)
c.setFillColor(TEXT_CYAN)
c.drawString(100, page_height - 315, "INCLUDED SCREENS:")
c.setFont("Helvetica", 11)
c.setFillColor(TEXT_WHITE)
c.drawString(240, page_height - 315, f"{len(slides_data)} Complete Views (Marketing, Modals, & 5 Dashboard Modules)")

# Table of contents box
c.setFillColor(colors.HexColor("#0f172a"))
c.setStrokeColor(colors.HexColor("#334155"))
c.roundRect(100, 100, card_w - 80, 130, 8, fill=1, stroke=1)

c.setFont("Helvetica-Bold", 10)
c.setFillColor(TEXT_EMERALD)
c.drawString(120, 205, "INDEX OF UI MODULES")

c.setFont("Helvetica", 9)
c.setFillColor(colors.HexColor("#cbd5e1"))

col1 = [
    "01. Landing Hero & Vector Synthesizer",
    "02. Dimension 01: Forensic Extraction",
    "03. Dimension 02: Framework Architecture",
    "04. Dimension 04: Institutional Research",
    "05. Dimension 05: Technical FAQ",
    "06. Executive Audit Request Modal"
]

col2 = [
    "07. Confidential Technical Briefing Modal",
    "08. Telemetry Authentication Portal",
    "09. Dashboard 01: AI Visibility & Trends",
    "10. Prompt Universe Output Trace Modal",
    "11. Dashboard 02: Competitive Position",
    "12. Dashboard 03: AI Accuracy & Trust"
]

col3 = [
    "13. JSON-LD Schema Remediation Modal",
    "14. Dashboard 04: Sources & Authority",
    "15. Synthesized Gap Outreach Modal",
    "16. Dashboard 05: Opportunities & ROI",
    "17. Action Lift Simulation Modal",
    "18. Account & Organization Settings"
]

y_start = 185
for i, item in enumerate(col1):
    c.drawString(120, y_start - (i * 13), item)
for i, item in enumerate(col2):
    c.drawString(340, y_start - (i * 13), item)
for i, item in enumerate(col3):
    c.drawString(560, y_start - (i * 13), item)

c.showPage()

# 2. SLIDES WITH SCREENSHOTS
for idx, slide in enumerate(slides_data, 1):
    img_path = slide.get("img_path")
    if not img_path or not os.path.exists(img_path):
        continue

    # Dark background
    c.setFillColor(BG_DARK)
    c.rect(0, 0, page_width, page_height, fill=1, stroke=0)

    # Top Header Bar
    c.setFillColor(BG_CARD)
    c.setStrokeColor(colors.HexColor("#1e293b"))
    c.setLineWidth(1)
    c.rect(0, page_height - 55, page_width, 55, fill=1, stroke=1)

    # Tag Badge
    c.setFillColor(colors.HexColor("#064e3b"))
    c.setStrokeColor(colors.HexColor("#10b98188"))
    c.roundRect(25, page_height - 40, 180, 20, 4, fill=1, stroke=1)

    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(TEXT_EMERALD)
    c.drawString(35, page_height - 33, slide["tag"])

    # Slide Title
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(TEXT_WHITE)
    c.drawString(220, page_height - 28, slide["title"])

    # Slide Subtitle
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawString(220, page_height - 44, slide["subtitle"])

    # Page indicator (right side)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TEXT_CYAN)
    c.drawRightString(page_width - 30, page_height - 35, f"PAGE {idx:02d} / {len(slides_data):02d}")

    # Main Image Container
    # Margin: 25pt left/right, 25pt bottom, 65pt top
    target_x = 25
    target_y = 28
    target_w = page_width - 50
    target_h = page_height - 90

    # Draw image
    c.drawImage(img_path, target_x, target_y, width=target_w, height=target_h, preserveAspectRatio=True, anchor='c')

    # Image outer subtle border
    c.setStrokeColor(colors.HexColor("#334155"))
    c.setLineWidth(0.75)
    c.rect(target_x, target_y, target_w, target_h, fill=0, stroke=1)

    # Bottom Footer
    c.setFont("Helvetica", 7.5)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(25, 14, "GEO Telemetry System • Confidential Client Dossier • OpenAI ChatGPT & SearchGPT Unified Engine")
    c.drawRightString(page_width - 25, 14, "https://github.com/fawazgp77-tech/GEO-TPF")

    c.showPage()

c.save()
print(f"\nPDF generated successfully at: {OUTPUT_PDF}")
print(f"File size: {os.path.getsize(OUTPUT_PDF):,} bytes")
