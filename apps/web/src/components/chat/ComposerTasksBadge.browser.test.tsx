import { expect, it } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import "~/index.css";
import { render } from "../../../test/render";
import { ComposerTasksPanel } from "./ComposerTasksBadge";

it("expands with the keyboard, updates the same checklist, and resets for another thread", async () => {
  const steps = [
    { step: "Inspect", status: "completed" as const, durationMs: 3_000 },
    { step: "Implement", status: "inProgress" as const },
    { step: "Verify", status: "pending" as const },
  ];
  const progress = { step: "Implement", completedSteps: 1, totalSteps: 3, live: true };
  await using screen = await render(
    <ComposerTasksPanel key="thread-a" progress={progress} steps={steps} />,
  );
  const summary = screen.getByRole("button", { name: /Tasks: 1 of 3/ });
  await userEvent.tab();
  await expect.element(summary).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  await expect.element(screen.getByRole("list")).toBeVisible();
  await expect.element(screen.getByText("Running:")).toBeVisible();
  await expect.element(screen.getByText("Pending:")).toBeVisible();
  await screen.rerender(
    <ComposerTasksPanel
      key="thread-a"
      progress={{ ...progress, step: "Verify", completedSteps: 2 }}
      steps={steps.map((step, i) => ({ ...step, status: i === 2 ? "inProgress" : "completed" }))}
    />,
  );
  await expect
    .element(screen.getByRole("list", { name: "Task list. 2 of 3 complete." }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: /Collapse tasks: 2 of 3/ }))
    .toHaveFocus();
  await screen.rerender(<ComposerTasksPanel key="thread-b" progress={progress} steps={steps} />);
  await expect.element(screen.getByRole("list")).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: /Tasks: 1 of 3/ }))
    .toHaveAttribute("aria-expanded", "false");
});
