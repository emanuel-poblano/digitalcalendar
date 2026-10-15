import assert from "node:assert/strict";
import test from "node:test";

import { expandOccurrences } from "./recurrence.ts";

test("expands recurring events beyond 1,000 occurrences from their start", () => {
  const occurrences = expandOccurrences(
    [{ id: "daily", start: "2020-01-01T10:00:00.000Z", recurrence: "daily" }],
    new Date("2026-10-14T00:00:00.000Z"),
    new Date("2026-10-17T00:00:00.000Z")
  );

  assert.deepEqual(
    occurrences.map((occurrence) => occurrence.occurrenceStart.toISOString()),
    [
      "2026-10-14T10:00:00.000Z",
      "2026-10-15T10:00:00.000Z",
      "2026-10-16T10:00:00.000Z",
    ]
  );
});
