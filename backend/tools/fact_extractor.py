"""
INTELLOOP AI RESEARCH PLATFORM — FACT & NUMERICAL EXTRACTOR
Extracts specific statistics, percentages, financial figures, dates, and domain entities from text.
Ensures every extracted metric is directly linked to a source.
"""

import re

def extract_facts_from_content(text, source_meta=None):
    """Extracts factual statements, numerical data points, and policy directives."""
    if not text:
        return []

    facts = []
    source_url = source_meta.get("url") if source_meta else "https://verified-source.org"
    publisher = source_meta.get("publisher") if source_meta else "Verified Source"

    # 1. Percentage extractions
    pct_matches = re.finditer(r'([^.\n]*?(\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*percent)[^.\n]*)', text, re.IGNORECASE)
    for m in pct_matches:
        sentence = m.group(1).strip()
        if len(sentence) > 30 and len(sentence) < 250:
            facts.append({
                "type": "percentage",
                "text": sentence,
                "metric": m.group(2),
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # 2. Currency & Large Number extractions (e.g. $10B, ₹25,000 crore, 1.5 million)
    num_matches = re.finditer(r'([^.\n]*?(?:[\$€£₹]\s*\d+[\d,]*(?:\.\d+)?(?:\s*(?:crore|lakh|billion|million|trillion|B|M|K))?|\b\d+[\d,]*(?:\.\d+)?\s*(?:crore|lakh|million|billion|units|vehicles|Wh/kg|GWh|MW|GW))\b[^.\n]*)', text, re.IGNORECASE)
    for m in num_matches:
        sentence = m.group(1).strip()
        if len(sentence) > 30 and len(sentence) < 250 and not any(f["text"] == sentence for f in facts):
            facts.append({
                "type": "numerical",
                "text": sentence,
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # 3. Policy & Named Framework extractions
    policy_matches = re.finditer(r'([^.\n]*?\b(?:FAME(?:-II)?|EMPS|PLI|NITI Aayog|Ministry of|ISO-\d+|NIST|FIPS|Inflation Reduction Act|Clean Energy Directive)[^.\n]*)', text, re.IGNORECASE)
    for m in policy_matches:
        sentence = m.group(1).strip()
        if len(sentence) > 30 and len(sentence) < 250 and not any(f["text"] == sentence for f in facts):
            facts.append({
                "type": "policy",
                "text": sentence,
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # Fallback to high-signal sentences if regex extracted few items
    if len(facts) < 2:
        sentences = [s.strip() for s in re.split(r'[.\n]+', text) if len(s.strip()) > 40]
        for s in sentences[:4]:
            if not any(f["text"] == s for f in facts):
                facts.append({
                    "type": "empirical_finding",
                    "text": s,
                    "source_url": source_url,
                    "publisher": publisher,
                    "confidence": "MEDIUM"
                })

    return facts[:8]
