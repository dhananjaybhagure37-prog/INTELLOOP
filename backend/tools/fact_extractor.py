import re

def clean_sentence(text):
    """Cleans markdown symbols and formatting to extract clean readable claims."""
    cleaned = re.sub(r'\[(.*?)\]\([^\)]+\)', r'\1', text)
    cleaned = re.sub(r'[*#>`]', '', cleaned)
    return re.sub(r'\s+', ' ', cleaned).strip()

def extract_facts_from_content(text, source_meta=None):
    """Extracts factual statements, numerical data points, and policy directives."""
    if not text:
        return []

    # Strip URLs and markdown link wrappers before regex parsing
    clean_text = re.sub(r'\[(.*?)\]\([^\)]+\)', r'\1', text)
    clean_text = re.sub(r'https?://\S+', '', clean_text)
    clean_text = re.sub(r'^[#>\-\*]+\s*', '', clean_text, flags=re.MULTILINE)

    facts = []
    source_url = source_meta.get("url") if source_meta else "https://verified-source.org"
    publisher = source_meta.get("publisher") if source_meta else "Verified Source"

    # 1. Percentage extractions
    pct_matches = re.finditer(r'([^.\n]*?(\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*percent)[^.\n]*)', clean_text, re.IGNORECASE)
    for m in pct_matches:
        raw_s = m.group(1).strip()
        sentence = clean_sentence(raw_s)
        if len(sentence) > 30 and len(sentence) < 250 and not any(f["text"] == sentence for f in facts):
            facts.append({
                "type": "percentage",
                "text": sentence,
                "metric": m.group(2),
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # 2. Currency & Large Number extractions (e.g. $10B, ₹25,000 crore, 1.5 million, 500 Wh/kg)
    num_matches = re.finditer(r'([^.\n]*?(?:[\$€£₹]\s*\d+[\d,]*(?:\.\d+)?(?:\s*(?:crore|lakh|billion|million|trillion|B|M|K))?|\b\d+[\d,]*(?:\.\d+)?\s*(?:crore|lakh|million|billion|units|vehicles|Wh/kg|GWh|MW|GW))\b[^.\n]*)', clean_text, re.IGNORECASE)
    for m in num_matches:
        raw_s = m.group(1).strip()
        sentence = clean_sentence(raw_s)
        if len(sentence) > 30 and len(sentence) < 250 and not any(f["text"] == sentence for f in facts):
            facts.append({
                "type": "numerical",
                "text": sentence,
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # 3. Policy & Named Framework extractions
    policy_matches = re.finditer(r'([^.\n]*?\b(?:FAME(?:-II)?|EMPS|PLI|NITI Aayog|Ministry of|ISO-\d+|NIST|FIPS|Inflation Reduction Act|Clean Energy Directive|Solid-State|QuantumScape|CATL|Samsung|Toyota)[^.\n]*)', clean_text, re.IGNORECASE)
    for m in policy_matches:
        raw_s = m.group(1).strip()
        sentence = clean_sentence(raw_s)
        if len(sentence) > 30 and len(sentence) < 250 and not any(f["text"] == sentence for f in facts):
            facts.append({
                "type": "policy",
                "text": sentence,
                "source_url": source_url,
                "publisher": publisher,
                "confidence": "HIGH"
            })

    # Fallback to high-signal sentences if regex extracted few items
    if len(facts) < 4:
        lines = [l.strip() for l in clean_text.splitlines() if l.strip()]
        for line in lines:
            for s in re.split(r'(?<=[.!?])\s+', line):
                clean_s = clean_sentence(s)
                if len(clean_s) > 35 and len(clean_s) < 250 and not any(f["text"] == clean_s for f in facts):
                    facts.append({
                        "type": "empirical_finding",
                        "text": clean_s,
                        "source_url": source_url,
                        "publisher": publisher,
                        "confidence": "HIGH"
                    })

    return facts[:8]
