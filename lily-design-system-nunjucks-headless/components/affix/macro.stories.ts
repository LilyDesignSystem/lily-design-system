import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="affix"
  style="position: sticky; top: 0;"></div>`;

const meta = {
  title: 'Headless/Affix',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
