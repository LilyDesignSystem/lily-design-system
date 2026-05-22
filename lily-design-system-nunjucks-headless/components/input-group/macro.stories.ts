import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="input-group"
  role="group"></div>`;

const meta = {
  title: 'Headless/InputGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
