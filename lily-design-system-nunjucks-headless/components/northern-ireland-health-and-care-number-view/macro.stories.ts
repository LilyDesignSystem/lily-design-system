import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="northern-ireland-health-and-care-number-view"></span>`;

const meta = {
  title: 'Headless/NorthernIrelandHealthAndCareNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
