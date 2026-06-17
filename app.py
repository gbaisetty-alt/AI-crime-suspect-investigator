from flask import Flask, jsonify, request
import time


app = Flask(__name__)


def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.after_request
def after_request(response):
    return add_cors(response)


def bubble_sort(records):
    items = [dict(record) for record in records]
    n = len(items)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if int(items[j]["severity"]) > int(items[j + 1]["severity"]):
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            break
    return items


def merge_sort(records):
    if len(records) <= 1:
        return [dict(record) for record in records]

    mid = len(records) // 2
    left = merge_sort(records[:mid])
    right = merge_sort(records[mid:])
    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if int(left[i]["severity"]) <= int(right[j]["severity"]):
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged


def build_benchmark_records(records):
    repeat_count = max(1, 1600 // max(len(records), 1))
    benchmark_records = []

    for repeat_index in range(repeat_count):
        for record in records:
            clone = dict(record)
            clone["id"] = f"{record['id']}-{repeat_index}"
            benchmark_records.append(clone)

    return benchmark_records


def timed_sort(sorter, records):
    benchmark_records = build_benchmark_records(records)
    start = time.perf_counter()
    sorter(benchmark_records)
    elapsed_ms = (time.perf_counter() - start) * 1000
    return sorter(records), elapsed_ms


@app.route("/", methods=["GET"])
def health_check():
    return jsonify(
        {
            "project": "Crime Record Analyzer & Sorting Performance Comparator",
            "status": "Backend running",
            "api": "/analyze",
        }
    )


@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_records():
    if request.method == "OPTIONS":
        return add_cors(jsonify({}))

    data = request.get_json(silent=True) or {}
    records = data.get("records", [])

    bubble_sorted, bubble_ms = timed_sort(bubble_sort, records)
    merge_sorted, merge_ms = timed_sort(merge_sort, records)

    response = {
        "bubble_sort": {
            "time": bubble_ms,
            "complexity": {
                "best": "O(n)",
                "average": "O(n²)",
                "worst": "O(n²)",
            },
            "sorted_records": bubble_sorted,
        },
        "merge_sort": {
            "time": merge_ms,
            "complexity": {
                "best": "O(n log n)",
                "average": "O(n log n)",
                "worst": "O(n log n)",
            },
            "sorted_records": merge_sorted,
        },
        "summary": {
            "time_saved": max(bubble_ms - merge_ms, 0),
            "fastest": "Bubble Sort" if bubble_ms <= merge_ms else "Merge Sort",
            "total_records": len(records),
        },
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
