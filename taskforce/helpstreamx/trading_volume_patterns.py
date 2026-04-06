from typing import List, Dict, Any


def detect_volume_bursts(
    volumes: List[float],
    threshold_ratio: float = 1.5,
    min_interval: int = 1
) -> List[Dict[str, Any]]:
    """
    Identify indices where volume jumps by threshold_ratio over the previous value.
    Returns list of dicts: {index, previous, current, ratio}.
    """
    events: List[Dict[str, Any]] = []
    last_idx = -min_interval

    for i in range(1, len(volumes)):
        prev, curr = volumes[i - 1], volumes[i]
        ratio = (curr / prev) if prev > 0 else float("inf")

        if ratio >= threshold_ratio and (i - last_idx) >= min_interval:
            events.append({
                "index": float(i),
                "previous": round(prev, 4),
                "current": round(curr, 4),
                "ratio": round(ratio, 4)
            })
            last_idx = i

    return events


def detect_volume_drops(
    volumes: List[float],
    drop_ratio: float = 0.5,
    min_interval: int = 1
) -> List[Dict[str, Any]]:
    """
    Identify indices where volume drops significantly below the previous value.
    Returns list of dicts: {index, previous, current, ratio}.
    """
    events: List[Dict[str, Any]] = []
    last_idx = -min_interval

    for i in range(1, len(volumes)):
        prev, curr = volumes[i - 1], volumes[i]
        ratio = (curr / prev) if prev > 0 else 0.0

        if ratio <= drop_ratio and (i - last_idx) >= min_interval:
            events.append({
                "index": float(i),
                "previous": round(prev, 4),
                "current": round(curr, 4),
                "ratio": round(ratio, 4)
            })
            last_idx = i

    return events


def summarize_volume_events(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Summarize detected volume events with statistics.
    """
    if not events:
        return {"count": 0, "avg_ratio": 0.0, "max_ratio": 0.0}

    ratios = [e["ratio"] for e in events]
    return {
        "count": len(events),
        "avg_ratio": round(sum(ratios) / len(ratios), 4),
        "max_ratio": round(max(ratios), 4)
    }


def detect_combined_events(
    volumes: List[float],
    up_threshold: float = 1.5,
    down_threshold: float = 0.5,
    min_interval: int = 1
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Detect both bursts and drops in one call.
    Returns a dictionary with 'bursts' and 'drops'.
    """
    return {
        "bursts": detect_volume_bursts(volumes, up_threshold, min_interval),
        "drops": detect_volume_drops(volumes, down_threshold, min_interval)
    }
