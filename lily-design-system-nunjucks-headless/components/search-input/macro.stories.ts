import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="search-input"
  type="search"
  id=""
  name=""
  value="">`;

const meta = {
  title: 'Headless/SearchInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
