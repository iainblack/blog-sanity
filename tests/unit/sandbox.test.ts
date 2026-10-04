import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/Firebase/FirebaseConfig", () => ({
  db: new Proxy({}, { get: () => { throw new Error("Firebase must not be touched in sandbox mode"); } }),
}));

describe("sandbox mode (MOCK_DATA=force) write paths", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("MOCK_DATA", "force");
  });

  it("subscriber list is served from memory, never Firebase", async () => {
    const fb = await import("../../utils/FirebaseUtils");
    expect(await fb.isOnSubscriberList("a@b.co")).toBe(false);
    expect(await fb.addToSubscriberList("a@b.co", { news: true })).toBe(true);
    expect(await fb.isOnSubscriberList("a@b.co")).toBe(true);
    expect(await fb.getSubscriberPreferences("a@b.co")).toEqual({ news: true });
    expect(await fb.updateSubscriberPreferences("a@b.co", { news: false })).toBe(true);
    expect(await fb.getSubscriberPreferences("a@b.co")).toEqual({ news: false });
    expect(await fb.removeFromSubscriberList("a@b.co")).toBe(true);
    expect(await fb.getSubscriberPreferences("a@b.co")).toBeNull();
  });

  it("suppression list is served from memory, never Postmark", async () => {
    const pm = await import("../../utils/PostmarkUtils");
    expect(await pm.isOnSuppressionList("a@b.co")).toBe(false);
    expect(await pm.addToSuppressionList("a@b.co")).toBe(true);
    expect(await pm.isOnSuppressionList("a@b.co")).toBe(true);
    expect(await pm.removeFromSuppressionList("a@b.co")).toBe(true);
    expect(await pm.isOnSuppressionList("a@b.co")).toBe(false);
  });
});
