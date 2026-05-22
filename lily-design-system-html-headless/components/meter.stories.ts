import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<meter
  class="meter"
  aria-label=""
  min="0"
  max="100"
  value="0"
>
  <!-- Consumer provides fallback text -->
</meter>`;

const meta = {
  title: 'Headless/Meter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
