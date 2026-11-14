import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="decision-support-card" role="group" aria-label="Penicillin allergy recorded" data-indicator="critical">\n  <p class="decision-support-card-header"><span class="decision-support-card-indicator">Critical</span> <span class="decision-support-card-summary">Penicillin allergy recorded</span></p>\n  <div class="decision-support-card-detail"><p>Amoxicillin is a penicillin.</p></div>\n  <p class="decision-support-card-source"><a href="#formulary">Local formulary</a></p>\n  <div class="decision-support-card-suggestions"><button type="button" class="decision-support-card-suggestion" data-recommended="true">Cancel amoxicillin</button></div>\n  <form class="decision-support-card-override">\n    <label class="decision-support-card-override-label">Reason for dismissing <select class="decision-support-card-override-reason" name="overrideReason" required><option value="">Choose a reason</option><option value="error">Allergy recorded in error</option></select></label>\n    <button type="submit" class="decision-support-card-dismiss">Dismiss</button>\n  </form>\n</div>';

const meta = {
    title: "Headless/Decision Support Card",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
