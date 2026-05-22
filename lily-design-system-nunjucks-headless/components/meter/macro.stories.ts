import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<meter
  class="meter"
  value=""
  min="0"
  max="100"></meter>`;

const meta = {
  title: 'Headless/Meter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
