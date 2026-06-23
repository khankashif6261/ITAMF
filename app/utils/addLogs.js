const AuditLog = require("../models/AuditModel");

async function addLog({
  userName,
  action,
  itemType,
  itemName = "",
  message,
}) {
  try {
    return await AuditLog.create({
      userName: userName || "Unknown User",
      action,
      itemType,
      itemName,
      message,
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
    return null;
  }
}

module.exports = addLog;