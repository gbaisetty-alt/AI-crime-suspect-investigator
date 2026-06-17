# Crime Record Analyzer & Sorting Performance Comparator

A full-stack academic project that compares Bubble Sort and Merge Sort while analyzing crime records by severity score.

## Features

- React + Vite frontend with a modern crime analytics dashboard
- Flask backend API using Python `time.perf_counter()`
- Bubble Sort and Merge Sort performance comparison
- Crime record entry form, statistics cards, tables, and sorted output
- Bar chart, pie chart, and severity trend line chart
- Responsive dark blue and white glassmorphism UI

## Folder Structure

```txt
crime-analyzer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── start_frontend.sh
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── start_backend.sh
└── README.md
```

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Or run the backend bash file:

```bash
cd backend
bash start_backend.sh
```

The Flask API runs at `http://127.0.0.1:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Or run the frontend bash file:

```bash
cd frontend
bash start_frontend.sh
```

The Vite app runs at `http://localhost:5175`.

## API

### `POST /analyze`

Request:

```json
{
  "records": [
    {
      "id": "CR-1001",
      "name": "Arjun Mehta",
      "type": "Cyber Crime",
      "severity": 88,
      "status": "Under Investigation"
    }
  ]
}
```

Response:

```json
{
  "bubble_sort": {
    "time": 184.23,
    "complexity": {
      "best": "O(n)",
      "average": "O(n²)",
      "worst": "O(n²)"
    },
    "sorted_records": []
  },
  "merge_sort": {
    "time": 3.42,
    "complexity": {
      "best": "O(n log n)",
      "average": "O(n log n)",
      "worst": "O(n log n)"
    },
    "sorted_records": []
  },
  "summary": {
    "time_saved": 180.81,
    "fastest": "Merge Sort",
    "total_records": 8
  }
}
```

## Algorithms

| Method | Description | Time Complexity |
| --- | --- | --- |
| Bubble Sort | Repeatedly swaps adjacent records until severity scores are sorted | Best: O(n), Average/Worst: O(n²) |
| Merge Sort | Recursively divides records and merges them in sorted order | O(n log n) |

## Team Members

- Nishok (2510030201)
- Padmavathi (2510030085)

## GitHub Requirement

Create a GitHub repository for this project and make regular commits because commit count carries marks weightage.
