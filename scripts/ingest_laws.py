def summarize_existing():
    """Show what's currently in raw_laws/."""
    total = 0
    for json_file in LAWS_DIR.glob("*.json"):
        # Skip empty files
        if json_file.stat().st_size == 0:
            print(f"  ⚠️  {json_file.name}: EMPTY — skipping")
            continue
        try:
            with open(json_file, encoding="utf-8") as f:
                data = json.load(f)
            print(f"  📂 {json_file.name}: {len(data)} sections")
            total += len(data)
        except json.JSONDecodeError:
            print(f"  ❌ {json_file.name}: Invalid JSON — skipping")
    print(f"\n  Total: {total} law sections in knowledge base")
    return total
