import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="text-input-with-search">
  <input
    class="text-input-with-search-input"
    type="search"
    id="text-input-with-search-input"
    value=""  >
  <button class="text-input-with-search-button" type="submit" aria-label="Search">Search</button>
</div>`;

const meta = {
  title: 'Headless/TextInputWithSearch',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
