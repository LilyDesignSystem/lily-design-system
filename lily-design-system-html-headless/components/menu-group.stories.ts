import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
-->

<div
  class="menu-group"
  role="group"
  aria-label=""
>
  <div class="menu-group-heading" aria-hidden="true"></div>
  <!-- Consumer inserts menu-item children here -->
</div>`;

const meta = {
  title: 'Headless/MenuGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
