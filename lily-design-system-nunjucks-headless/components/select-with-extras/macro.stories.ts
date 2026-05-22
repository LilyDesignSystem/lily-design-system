import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="select-with-extras"
  data-module="select-with-extras"></select>`;

const meta = {
  title: 'Headless/SelectWithExtras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
