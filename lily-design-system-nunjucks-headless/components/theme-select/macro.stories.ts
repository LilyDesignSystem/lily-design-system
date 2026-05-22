import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="theme-select"></select>`;

const meta = {
  title: 'Headless/ThemeSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
