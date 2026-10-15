import { describe, expect, it } from "vitest";
import { formatSlotTime, upcomingSlots } from "./slots";

describe("upcomingSlots", () => {
  // Donderdag 15 oktober 2026, 20:00 Nederlandse tijd (zomertijd, UTC+2)
  const now = new Date("2026-10-15T18:00:00Z");

  it("geeft alleen werkdagen van 09:00 tot 17:00 Nederlandse tijd", () => {
    const slots = upcomingSlots(now, [], 4);
    // vr 16 en ma 19 (za 17 en zo 18 vallen af) = 2 dagen x 8 slots
    expect(slots).toHaveLength(16);
    expect(slots[0].toISOString()).toBe("2026-10-16T07:00:00.000Z");
    expect(formatSlotTime(slots[0])).toBe("09:00");
    expect(formatSlotTime(slots[7])).toBe("16:00");
  });

  it("laat bezette slots weg", () => {
    const taken = [new Date("2026-10-16T07:00:00Z")];
    const slots = upcomingSlots(now, taken, 1);
    expect(slots).toHaveLength(7);
    expect(slots[0].toISOString()).toBe("2026-10-16T08:00:00.000Z");
  });

  it("houdt rekening met wintertijd", () => {
    const slots = upcomingSlots(new Date("2026-11-02T12:00:00Z"), [], 1);
    expect(slots[0].toISOString()).toBe("2026-11-03T08:00:00.000Z");
  });
});
