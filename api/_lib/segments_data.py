"""
Audience segment definitions for the Egg Digital Dynamic Creative Intelligence Platform.

Each segment represents a distinct target audience with associated visual and tonal attributes
used to guide creative generation.
"""

SEGMENTS = [
    {
        "id": "health_wellness_enthusiasts",
        "name": "Health & Wellness Enthusiasts",
        "age_range": "25-45",
        "description": (
            "Individuals passionate about healthy living, fitness, nutrition, and holistic "
            "well-being. They value natural products and mindful lifestyle choices."
        ),
        "visual_style": "natural, organic, warm lighting",
        "color_tone": "greens, earth tones, soft whites",
        "mood": "calm, energized, balanced",
    },
    {
        "id": "young_professionals",
        "name": "Young Professionals / Office Workers",
        "age_range": "25-35",
        "description": (
            "Career-driven individuals in urban settings who seek efficiency, style, and "
            "products that complement their fast-paced professional lifestyle."
        ),
        "visual_style": "clean, modern, aspirational, urban",
        "color_tone": "cool blues, whites, minimal",
        "mood": "confident, ambitious, productive",
    },
    {
        "id": "outdoor_adventure_seekers",
        "name": "Outdoor & Adventure Seekers",
        "age_range": "20-40",
        "description": (
            "Active individuals who thrive on outdoor activities, travel, and exploration. "
            "They value durability, performance, and connection with nature."
        ),
        "visual_style": "dynamic, rugged, natural landscapes",
        "color_tone": "earth tones, sky blues, forest greens",
        "mood": "adventurous, free, energetic",
    },
    {
        "id": "eco_conscious_consumers",
        "name": "Eco-Conscious Consumers",
        "age_range": "22-45",
        "description": (
            "Environmentally aware individuals who prioritize sustainability, ethical sourcing, "
            "and minimal environmental impact in their purchasing decisions."
        ),
        "visual_style": "sustainable, minimal, nature-inspired",
        "color_tone": "forest greens, recycled textures, earth",
        "mood": "responsible, mindful, hopeful",
    },
    {
        "id": "gen_z_social_media",
        "name": "Gen Z / Social Media Savvy",
        "age_range": "16-27",
        "description": (
            "Digital natives who are highly active on social platforms, value authenticity, "
            "and are drawn to bold, trend-forward visual content."
        ),
        "visual_style": "bold, trendy, vibrant, meme-inspired",
        "color_tone": "neon, pastels, gradient",
        "mood": "playful, authentic, expressive",
    },
    {
        "id": "busy_parents",
        "name": "Busy Parents / On-the-Go",
        "age_range": "28-45",
        "description": (
            "Parents juggling family responsibilities and work who value convenience, "
            "reliability, and family-oriented products and messaging."
        ),
        "visual_style": "warm, family-friendly, practical",
        "color_tone": "warm yellows, soft blues, nurturing",
        "mood": "caring, efficient, happy",
    },
    {
        "id": "premium_luxury_seekers",
        "name": "Premium / Luxury Seekers",
        "age_range": "30-55",
        "description": (
            "Discerning consumers who seek premium quality, exclusivity, and sophisticated "
            "brand experiences. They appreciate craftsmanship and status."
        ),
        "visual_style": "elegant, sophisticated, high-end",
        "color_tone": "gold, black, deep jewel tones",
        "mood": "exclusive, refined, aspirational",
    },
    {
        "id": "active_seniors",
        "name": "Active Seniors",
        "age_range": "55+",
        "description": (
            "Older adults who maintain active lifestyles, value clarity and accessibility, "
            "and appreciate straightforward, trustworthy messaging."
        ),
        "visual_style": "bright, accessible, friendly",
        "color_tone": "warm, soft pastels, classic",
        "mood": "active, content, wise",
    },
]

SEGMENTS_BY_ID = {seg["id"]: seg for seg in SEGMENTS}


def get_all_segments():
    """Return all audience segments."""
    return SEGMENTS


def get_segment_by_id(segment_id):
    """Return a single segment by its ID, or None if not found."""
    return SEGMENTS_BY_ID.get(segment_id)


def get_segments_by_ids(segment_ids):
    """Return segments matching the given list of IDs. Skips unknown IDs."""
    return [SEGMENTS_BY_ID[sid] for sid in segment_ids if sid in SEGMENTS_BY_ID]
