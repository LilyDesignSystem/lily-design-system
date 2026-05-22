import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="button"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
