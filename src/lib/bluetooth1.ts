// lib/bluetooth1.ts

export async function sendVibration(pattern: number[]) {
  const response = await fetch("http://127.0.0.1:5000/vibrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ s: pattern })
  });

  if (!response.ok) {
    throw new Error("LinguaVibe service not running");
  }
}
