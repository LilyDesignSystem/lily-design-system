import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="convert-from-value-div"></div>`;

const meta = {
  title: 'Headless/ConvertFromValueDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
