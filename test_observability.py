import urllib.request
import json
import time

def test_observability():
    # 1. Test GET /api/traces
    req = urllib.request.urlopen('http://localhost:3000/api/traces')
    data = json.loads(req.read().decode('utf-8'))
    print(f"Traces Endpoint HTTP 200: {len(data.get('traces', []))} missions cataloged in database.")

    # 2. Launch a Controlled Failure Demo Mission
    payload = json.dumps({
        'question': 'Investigate solid state quantum battery electrolyte safety and degradation mechanisms',
        'domain': 'Clean Energy',
        'depth': 'Standard',
        'demo_failure': True
    }).encode('utf-8')

    post_req = urllib.request.Request(
        'http://localhost:3000/api/investigations',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    post_res = urllib.request.urlopen(post_req)
    post_data = json.loads(post_res.read().decode('utf-8'))
    inv_id = post_data['investigation_id']
    print(f"\n[DEMO FAILURE DISPATCHED] Mission ID: {inv_id}")

    # 3. Wait for mission completion (polling status)
    for i in range(25):
        time.sleep(2)
        stat_req = urllib.request.urlopen(f'http://localhost:3000/api/investigations/{inv_id}')
        stat_data = json.loads(stat_req.read().decode('utf-8'))
        st = stat_data.get('status')
        print(f"  Step {i+1} — Mission status: {st}")
        if st in ('COMPLETED', 'FAILED'):
            break

    # 4. Check Trace Summary & Auto-Diagnosis
    sum_req = urllib.request.urlopen(f'http://localhost:3000/api/traces/{inv_id}/summary')
    sum_data = json.loads(sum_req.read().decode('utf-8'))
    print("\n========================================================")
    print(" TASK 7 OBSERVABILITY & AUTO-DIAGNOSIS TELEMETRY REPORT")
    print("========================================================")
    print(f"Mission ID: {sum_data.get('mission_id')}")
    print(f"Trace Spans Captured: {sum_data.get('trace_count')}")
    print(f"Auto-Diagnosis Summary: {sum_data.get('diagnosis', {}).get('summary')}")
    print("\nIdentified Diagnoses:")
    for d in sum_data.get('diagnosis', {}).get('diagnoses', []):
        print(f" -> Root Cause: [{d.get('root_cause')}] (Confidence: {d.get('confidence')})")
        print(f"    Status: {d.get('status')}")
        print(f"    Affected Component: {d.get('affected_component')}")
        print(f"    Evidence: {d.get('evidence')}")
        print(f"    Recommended Action: {d.get('recommended_action')}")

    print("\nBefore vs. After Optimization Benchmarks:")
    metrics = sum_data.get('metrics', {})
    print(f" -> Before Execution Time: {metrics.get('before', {}).get('execution_time_sec')}s | After: {metrics.get('after', {}).get('execution_time_sec')}s (Improvement: {metrics.get('improvement', {}).get('execution_time_improvement_pct')})")
    print(f" -> Before Errors: {metrics.get('before', {}).get('errors')} | After: {metrics.get('after', {}).get('errors')} (Reduction: {metrics.get('improvement', {}).get('error_reduction_pct')})")
    print(f" -> Before Tool Calls: {metrics.get('before', {}).get('tool_calls')} | After: {metrics.get('after', {}).get('tool_calls')} (Reduction: {metrics.get('improvement', {}).get('tool_call_reduction_pct')})")
    print(f" -> Outcome: {metrics.get('before', {}).get('task_status')} -> {metrics.get('after', {}).get('task_status')}")
    print("========================================================\n")

if __name__ == '__main__':
    test_observability()
