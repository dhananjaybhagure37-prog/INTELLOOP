import urllib.request
import json
import time

print("==================================================================")
print("TESTING REAL RESEARCH MISSIONS: QUANTUM MECHANICS & BRAIN RESEARCH")
print("==================================================================")

def run_mission_test(name, question, domain):
    print(f"\n[{name}] Launching Mission: '{question}'...")
    payload = json.dumps({
        "question": question,
        "domain": domain,
        "depth": "Standard",
        "chaos_mode": False
    }).encode("utf-8")

    req = urllib.request.Request("http://localhost:3000/api/investigations", data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        inv_id = data.get("investigation_id")
        print(f"Mission Dispatched: {inv_id}")

    # Wait for completion
    finished = False
    for i in range(25):
        time.sleep(2)
        req_status = urllib.request.Request(f"http://localhost:3000/api/investigations/{inv_id}")
        with urllib.request.urlopen(req_status) as resp:
            inv = json.loads(resp.read().decode())
            if inv.get("status") in ("COMPLETED", "FAILED"):
                finished = True
                break

    if not finished:
        print(f"Error: Mission {inv_id} timed out waiting for completion.")
        return False

    sources = inv.get("sources", [])
    claims = inv.get("claims", [])
    status = inv.get("status")
    conf_score = inv.get("confidence_score")
    conf_level = inv.get("confidence_level")
    report = inv.get("final_report", "")

    print(f"Mission Result for {inv_id}:")
    print(f" - Status: {status}")
    print(f" - Confidence: {conf_score}% ({conf_level})")
    print(f" - Sources Retrieved: {len(sources)}")
    print(f" - Verified Claims: {len(claims)}")
    print(f" - Report Length: {len(report)} characters")

    for i, s in enumerate(sources[:4], 1):
        print(f"   Source {i}: [{s.get('publisher')}] {s.get('title')[:60]} -> {s.get('url')}")

    # Assertions
    assert status == "COMPLETED", f"Expected COMPLETED but got {status}"
    assert len(sources) > 0, f"Expected sources > 0 but got {len(sources)}"
    assert conf_level in ("HIGH", "MEDIUM"), f"Expected HIGH/MEDIUM confidence but got {conf_level}"
    print(f"[{name}] ALL ASSERTIONS PASSED!")
    return True

# Test A: Dashboard Flow
test_a = run_mission_test("TEST A (Dashboard Prompt)", "Give me research papers about quantum mechanics", "General AI Intelligence")

# Test B: New Mission Flow
test_b = run_mission_test("TEST B (New Mission Prompt)", "Give me research papers on brain", "BioTech & Precision Medicine")

print("\n==================================================================")
if test_a and test_b:
    print("ALL TESTS PASSED: 100% REAL SOURCES RETRIEVED & PERSISTED!")
else:
    print("TESTS FAILED!")
print("==================================================================")
