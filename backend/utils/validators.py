def validate_campaign(data):
    # minimal validation
    required = ["campaign_name", "client_name"]
    for r in required:
        if not data.get(r):
            return False, f"{r} is required"
    # optional: validate status
    status = data.get("status", "Active")
    if status not in ["Active", "Paused", "Completed"]:
        return False, "Invalid status"
    return True, ""
