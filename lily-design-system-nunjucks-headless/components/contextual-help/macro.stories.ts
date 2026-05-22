import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="contextual-help">
  <button
    class="contextual-help-trigger"
    type="button"
    aria-label=""
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="contextual-help-panel"
  >?</button>
  <div
    class="contextual-help-panel"
    id="contextual-help-panel"
    role="dialog" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/ContextualHelp',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
