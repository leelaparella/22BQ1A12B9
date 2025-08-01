export function loggerMiddleware(logMessage) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] - ${logMessage}`;
  // Save to localStorage or send to remote logging service
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push(log);
  localStorage.setItem("logs", JSON.stringify(logs));
}
