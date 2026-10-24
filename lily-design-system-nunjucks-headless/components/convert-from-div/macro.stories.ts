import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="convert-from-div"></div>`;

const meta = {
  title: 'Headless/ConvertFromDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
