import math
from typing import Dict, Any

def calculate_risk_score(price_change_pct: float, liquidity_usd: float, flags_mask: int) -> float:
    """
    Compute a 0–100 risk score.

    Parameters:
    - price_change_pct: percent change over period (e.g. +5.0 for +5%).
    - liquidity_usd: total liquidity in USD.
    - flags_mask: integer bitmask of risk flags; each set bit adds a penalty.

    Components:
    - Volatility: up to 50 points
    - Liquidity: up to 30 points (lower with higher liquidity)
    - Flags: 5 points per flag
    """
    # volatility component (max 50)
    vol_score = min(abs(price_change_pct) / 10, 1) * 50

    # liquidity component: more liquidity = lower risk, up to 30
    if liquidity_usd > 0:
        liq_score = max(0.0, 30 - (math.log10(liquidity_usd) * 5))
    else:
        liq_score = 30.0

    # flag penalty: 5 points per bit set
    flag_count = bin(flags_mask).count("1")
    flag_score = flag_count * 5

    raw_score = vol_score + liq_score + flag_score
    return min(round(raw_score, 2), 100.0)


def explain_risk_factors(price_change_pct: float, liquidity_usd: float, flags_mask: int) -> Dict[str, Any]:
    """
    Break down how the risk score is calculated for transparency.
    """
    vol_score = min(abs(price_change_pct) / 10, 1) * 50
    liq_score = max(0.0, 30 - (math.log10(liquidity_usd) * 5)) if liquidity_usd > 0 else 30.0
    flag_count = bin(flags_mask).count("1")
    flag_score = flag_count * 5

    breakdown = {
        "volatility_component": round(vol_score, 2),
        "liquidity_component": round(liq_score, 2),
        "flags_component": flag_score,
        "flags_count": flag_count,
        "final_score": calculate_risk_score(price_change_pct, liquidity_usd, flags_mask),
    }
    return breakdown


def is_high_risk(score: float, threshold: float = 70.0) -> bool:
    """
    Determine if the score indicates high risk based on a threshold.
    """
    return score >= threshold


def compare_risk(asset_a: Dict[str, Any], asset_b: Dict[str, Any]) -> str:
    """
    Compare two assets and return which one is riskier.
    Each asset dict must contain price_change_pct, liquidity_usd, and flags_mask.
    """
    score_a = calculate_risk_score(
        asset_a["price_change_pct"], asset_a["liquidity_usd"], asset_a["flags_mask"]
    )
    score_b = calculate_risk_score(
        asset_b["price_change_pct"], asset_b["liquidity_usd"], asset_b["flags_mask"]
    )

    if score_a > score_b:
        return f"Asset A is riskier with score {score_a} vs Asset B {score_b}"
    elif score_b > score_a:
        return f"Asset B is riskier with score {score_b} vs Asset A {score_a}"
    else:
        return f"Both assets have equal risk with score {score_a}"
