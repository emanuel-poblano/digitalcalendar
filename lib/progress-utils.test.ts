import assert from "node:assert/strict";
import test from "node:test";

import { calculateGoalProgress } from "./progress-utils.ts";

test("caps progress at 100% when current exceeds the target", () => {
  assert.equal(calculateGoalProgress(20, 15), 100);
});

test("rounds partial progress to a whole percentage", () => {
  assert.equal(calculateGoalProgress(10, 25), 40);
});
