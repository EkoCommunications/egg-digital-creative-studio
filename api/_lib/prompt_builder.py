"""
Prompt construction logic for the Creative Intelligence Platform.

Builds detailed prompts for Gemini image generation based on segment attributes,
edit areas, and aspect ratio.
"""

# Aspect ratio to approximate pixel dimensions mapping
ASPECT_RATIO_DIMENSIONS = {
    "auto": ("1024", "1024"),
    "1:1": ("1024", "1024"),
    "16:9": ("1344", "756"),
    "9:16": ("756", "1344"),
}

# Edit area instruction templates
EDIT_AREA_INSTRUCTIONS = {
    "actor": (
        "ACTOR/MODEL: Adapt the person/model in the image to resonate with the target "
        "audience. Adjust styling, clothing, expressions, and demographics to reflect "
        "the {segment_name} segment (age range {age_range}). The model should feel "
        "relatable and aspirational to this audience."
    ),
    "background": (
        "BACKGROUND/ENVIRONMENT: Transform the background setting to match the visual "
        "preferences of the {segment_name} segment. Use {visual_style} aesthetics with "
        "{color_tone} color palette. The environment should evoke a {mood} feeling."
    ),
    "text": (
        "TEXT/COPY OVERLAY: If there is text in the image, adapt the typography, font "
        "style, and messaging tone to appeal to the {segment_name} audience. Use a "
        "style that is {visual_style} and conveys a {mood} tone. Ensure text remains "
        "legible and professional."
    ),
}


def build_prompt(segment, edit_areas, aspect_ratio="auto", has_brand_ci=False):
    """
    Build a detailed generation prompt for a given segment.

    Args:
        segment: Dict with segment data (name, age_range, visual_style, etc.)
        edit_areas: List of areas to modify, e.g. ["actor", "background", "text"]
        aspect_ratio: Target aspect ratio string.
        has_brand_ci: Whether brand CI document was provided.

    Returns:
        A fully constructed prompt string.
    """
    width, height = ASPECT_RATIO_DIMENSIONS.get(
        aspect_ratio, ASPECT_RATIO_DIMENSIONS["auto"]
    )

    # Build modification instructions for each requested edit area
    modification_lines = []
    for area in edit_areas:
        template = EDIT_AREA_INSTRUCTIONS.get(area)
        if template:
            instruction = template.format(
                segment_name=segment["name"],
                age_range=segment["age_range"],
                visual_style=segment["visual_style"],
                color_tone=segment["color_tone"],
                mood=segment["mood"],
            )
            modification_lines.append(f"- {instruction}")

    if not modification_lines:
        modification_lines.append(
            "- Apply general visual adjustments to match the target segment's "
            "aesthetic preferences, color palette, and mood."
        )

    modifications_block = "\n".join(modification_lines)

    brand_ci_note = ""
    if has_brand_ci:
        brand_ci_note = (
            "\nBRAND CI REFERENCE:\n"
            "A brand CI document has been provided. Ensure all modifications respect "
            "the brand guidelines including logo usage, brand colors, typography rules, "
            "and overall brand identity. Do not alter protected brand elements.\n"
        )

    prompt = f"""You are a marketing creative AI specializing in creating personalized advertising visuals.

TASK: Modify the provided reference image for the target audience segment.

TARGET AUDIENCE:
- Segment: {segment["name"]}
- Age Range: {segment["age_range"]}
- Visual Style: {segment["visual_style"]}
- Color Tones: {segment["color_tone"]}
- Mood: {segment["mood"]}
- Description: {segment["description"]}

MODIFICATIONS REQUIRED:
{modifications_block}
{brand_ci_note}
ASPECT RATIO: {aspect_ratio} ({width}x{height})

IMPORTANT GUIDELINES:
- Maintain the product/brand as the focal point
- Keep professional marketing quality suitable for advertising campaigns
- The image should feel authentic to the target segment
- Preserve brand elements (logo, product placement)
- Ensure the output is visually cohesive and polished
- The result should be immediately usable in a marketing context
- Generate an image that matches the specified aspect ratio"""

    return prompt.strip()


def build_prompts_for_segments(segments, edit_areas, aspect_ratio="auto", has_brand_ci=False):
    """
    Build prompts for multiple segments.

    Args:
        segments: List of segment dicts.
        edit_areas: List of edit area strings.
        aspect_ratio: Target aspect ratio.
        has_brand_ci: Whether brand CI was provided.

    Returns:
        List of (segment, prompt) tuples.
    """
    return [
        (segment, build_prompt(segment, edit_areas, aspect_ratio, has_brand_ci))
        for segment in segments
    ]
