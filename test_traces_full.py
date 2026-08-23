import urllib.request
import json
import time

print("Testing End-to-End Traces and Activity Logs Sync...")

# 1. Check /api/logs
req = urllib.request.Request("http://localhost:3000/api/logs")
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    logs = data.get("logs", [])
    print(f"Total Activity Logs in SQLite: {len(logs)}")
    if logs:
        print("Sample Latest Log Event:")
        print(f"  - Mission: {logs[0].get('missionId')}")
        print(f"  - Type: {logs[0].get('type')}")
        print(f"  - Summary: {logs[0].get('summary')}")
        print(f"  - Duration: {logs[0].get('durationMs')}ms")

# 2. Launch a Live Autonomous Mission to test real-time 15-stage tracing
post_data = json.dumps({
    "question": "Assess carbon capture efficiency and biological mineralization pathways in industrial cement production",
    "domain": "Clean Energy & Carbon Capture",
    "depth": "Standard",
    "chaos_mode": False,
    "demo_failure": True
}).encode("utf-8")

req_mission = urllib.request.Request(
    "http://localhost:3000/api/investigations",
    data=post_data,
    headers={"Content-Type": "application/json"}
)

with urllib.request.urlopen(req_mission) as resp:
    inv = json.loads(resp.read().decode())
    mission_id = inv.get("investigation_id") or inv.get("id")
    print(f"\nDispatched Autonomous Mission: {mission_id}")

# 3. Wait for mission to complete
print("Streaming execution and waiting for completion...")
for i in range(40):
    time.sleep(2)
    req_status = urllib.request.Request(f"http://localhost:3000/api/investigations/{mission_id}")
    with urllib.request.urlopen(req_status) as resp:
        status_data = json.loads(resp.read().decode())
        curr_status = status_data.get("status")
        print(f"  [{i*2}s] Status: {curr_status}")
        if curr_status in ("COMPLETED", "FAILED"):
            print(f"\nMission finished with status: {curr_status}")
            print(f"Confidence Score: {status_data.get('confidence_score')}% ({status_data.get('confidence_level')})")
            print(f"Execution Time: {status_data.get('execution_time_ms')}ms")
            break

# 4. Fetch Mission Spans from /api/traces/<id>
req_traces = urllib.request.Request(f"http://localhost:3000/api/traces/{mission_id}")
with urllib.request.urlopen(req_traces) as resp:
    traces = json.loads(resp.read().decode()).get("traces", [])
    print(f"\nCaptured {len(traces)} granular lifecycle events for mission {mission_id}:")
    for idx, t in enumerate(traces, 1):
        print(f"  {idx:02d}. [{t.get('stage')}] {t.get('event_type')} ({t.get('latency_ms')}ms) - Status: {t.get('status')}")

# 5. Fetch Activity Logs for this mission from /api/logs
req_logs = urllib.request.Request("http://localhost:3000/api/logs")
with urllib.request.urlopen(req_logs) as resp:
    all_logs = json.loads(resp.read().decode()).get("logs", [])
    mission_logs = [l for l in all_logs if l.get("missionId") == mission_id]
    print(f"\nActivity Logs synchronized for {mission_id}: {len(mission_logs)} events recorded in SQLite activity_logs!")
    for l in mission_logs:
        print(f"  - [{l.get('timestamp')}] {l.get('type')}: {l.get('summary')[:90]}...")
