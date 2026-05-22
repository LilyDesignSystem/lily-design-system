import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="input-group"
  role="group"
  aria-label=""
>
  <!-- Optional prefix addon (e.g., currency symbol, icon) -->
  <span class="input-group-prefix">
    <!-- Consumer provides prefix content -->
  </span>

  <!-- Consumer-supplied input goes here -->

  <!-- Optional suffix addon (e.g., unit, button, icon) -->
  <span class="input-group-suffix">
    <!-- Consumer provides suffix content -->
  </span>
</div>`;

const meta = {
  title: 'Headless/InputGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
