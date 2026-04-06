import math
from typing import List, Dict, Any


def compute_shannon_entropy(addresses: List[str]) -> float:
    """
    Compute Shannon entropy (bits) of an address sequence.
    Entropy reflects the unpredictability of the distribution.
    """
    if not addresses:
        return 0.0

    freq: Dict[str, int] = {}
    for a in addresses:
        freq[a] = freq.get(a, 0) + 1

    total = len(addresses)
    entropy = 0.0
    for count in freq.values():
        p = count / total
        entropy -= p * math.log2(p)

    return round(entropy, 4)


def entropy_breakdown(addresses: List[str]) -> Dict[str, Any]:
    """
    Provide detailed breakdown of entropy calculation,
    including frequency distribution and probabilities.
    """
    if not addresses:
        return {"entropy": 0.0, "distribution": {}}

    freq: Dict[str, int] = {}
    for a in addresses:
        freq[a] = freq.get(a, 0) + 1

    total = len(addresses)
    distribution: Dict[str, float] = {
        addr: round(count / total, 4) for addr, count in freq.items()
    }

    return {
        "entropy": compute_shannon_entropy(addresses),
        "distribution": distribution,
        "unique_count": len(freq),
        "total_count": total
    }


def normalized_entropy(addresses: List[str]) -> float:
    """
    Compute normalized entropy [0.0–1.0],
    dividing Shannon entropy by maximum possible entropy.
    """
    if not addresses:
        return 0.0

    unique_count = len(set(addresses))
    if unique_count <= 1:
        return 0.0

    max_entropy = math.log2(unique_count)
    actual_entropy = compute_shannon_entropy(addresses)
    return round(actual_entropy / max_entropy, 4)


def compare_entropy(seq_a: List[str], seq_b: List[str]) -> str:
    """
    Compare entropy values between two address sequences.
    """
    ent_a = compute_shannon_entropy(seq_a)
    ent_b = compute_shannon_entropy(seq_b)

    if ent_a > ent_b:
        return f"Sequence A is more diverse ({ent_a} vs {ent_b})"
    elif ent_b > ent_a:
        return f"Sequence B is more diverse ({ent_b} vs {ent_a})"
    return f"Both sequences have equal entropy ({ent_a})"
