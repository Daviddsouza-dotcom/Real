// lib/bluetooth1.ts



export class BluetoothManager1 {

  async send4MotorPattern(motors: Array<{M1: number, M2: number, M3: number, M4: number, duration: number}>): Promise<void> {
    
    try {
      for (const motor of motors) {
        const jsonData = { s: [motor.M1, motor.M2, motor.M3, motor.M4, motor.duration] };
        const jsonString = JSON.stringify(jsonData) + '\n';
        const encoder = new TextEncoder();
        const data = encoder.encode(jsonString);

        const response = await fetch("http://127.0.0.1:5000/vibrate", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: data });
	  }
	} if (!response.ok) {
      throw new Error("LinguaVibe service not running");
    }
  }

export const bluetoothManager1 = new BluetoothManager1();
