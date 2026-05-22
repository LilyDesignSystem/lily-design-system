import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tag-input"
  data-module="tag-input">
  <ul class="tag-input-list" role="list">  </ul>
  <input
    class="tag-input-field"
    type="text"  >
</div>`;

const meta = {
  title: 'Headless/TagInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
