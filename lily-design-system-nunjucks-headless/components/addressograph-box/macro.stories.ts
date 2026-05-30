import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="addressograph-box"
></div>`;

const meta = {
  title: 'Headless/AddressographBox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
