import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<progress
  class="progress"
  aria-label=""
  max="100"
  value="0"
>
  <!-- Consumer provides fallback text -->
</progress>`;

const meta = {
  title: 'Headless/Progress',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
