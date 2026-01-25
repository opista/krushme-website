
import { DateTime } from "luxon";

const now = DateTime.now().setZone("Europe/London").set({ second: 30, millisecond: 500 });
console.log("Now:", now.toISOTime());

const units = { hour: 9, minute: 0, second: 0, millisecond: 0 };
const result = now.set(units);

console.log("Result:", result.toISOTime());
console.log("Second:", result.second);
console.log("Millisecond:", result.millisecond);
