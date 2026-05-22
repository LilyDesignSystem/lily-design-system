import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="check-list-item">
  <input
    type="checkbox"
    class="check-list-item-input"    value="on"  >
  <label class="check-list-item-label"></label>
</li>`;

const meta = {
  title: 'Headless/CheckListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
