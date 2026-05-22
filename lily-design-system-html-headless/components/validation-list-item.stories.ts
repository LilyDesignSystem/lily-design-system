import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="validation-list-item"
  data-status="pending"
  aria-label=""
>
  <!-- Consumer-provided rule text (e.g. "At least 8 characters") -->
</li>`;

const meta = {
  title: 'Headless/ValidationListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
