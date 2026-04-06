from typing import List, Tuple, Dict

def generate_activity_heatmap(
    timestamps: List[int],
    counts: List[int],
    buckets: int = 10,
    normalize: bool = True
) -> List[float]:
    """
    Bucket activity counts into 'buckets' time intervals,
    returning either raw counts or normalized [0.0–1.0].

    Parameters:
    - timestamps: list of epoch ms timestamps.
    - counts: list of integer counts per timestamp.
    - buckets: number of intervals to divide the range into.
    - normalize: if True, scale values into [0.0–1.0].
    """
    if not timestamps or not counts or len(timestamps) != len(counts):
        return []

    t_min, t_max = min(timestamps), max(timestamps)
    span = t_max - t_min or 1
    bucket_size = span / buckets

    agg = [0] * buckets
    for t, c in zip(timestamps, counts):
        idx = min(buckets - 1, int((t - t_min) / bucket_size))
        agg[idx] += c

    if normalize:
        m = max(agg) or 1
        return [round(val / m, 4) for val in agg]
    return agg


def generate_heatmap_with_boundaries(
    timestamps: List[int],
    counts: List[int],
    buckets: int = 10,
    normalize: bool = True
) -> List[Tuple[Tuple[int, int], float]]:
    """
    Generate heatmap with explicit bucket boundaries.
    Returns a list of ((start, end), value).
    """
    if not timestamps or not counts or len(timestamps) != len(counts):
        return []

    t_min, t_max = min(timestamps), max(timestamps)
    span = t_max - t_min or 1
    bucket_size = span / buckets

    raw_values = generate_activity_heatmap(timestamps, counts, buckets, normalize)
    boundaries: List[Tuple[Tuple[int, int], float]] = []

    for i, val in enumerate(raw_values):
        start = int(t_min + i * bucket_size)
        end = int(start + bucket_size)
        boundaries.append(((start, end), val))

    return boundaries


def summarize_heatmap(values: List[float]) -> Dict[str, float]:
    """
    Return summary statistics of a heatmap.
    """
    if not values:
        return {"min": 0.0, "max": 0.0, "mean": 0.0}

    n = len(values)
    total = sum(values)
    return {
        "min": round(min(values), 4),
        "max": round(max(values), 4),
        "mean": round(total / n, 4)
    }


def detect_peak_buckets(values: List[float], threshold: float = 0.8) -> List[int]:
    """
    Detect indices of buckets that exceed a normalized threshold.
    """
    return [i for i, v in enumerate(values) if v >= threshold]
