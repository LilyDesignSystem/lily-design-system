import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li class="icon-list-item">
  <span
    class="icon-list-item-icon"
    aria-hidden="true"
  >
    <!-- Consumer provides decorative icon content (svg, glyph, emoji) -->
  </span>
  <span class="icon-list-item-text">
    <!-- Consumer provides accessible text content -->
  </span>
</li>`;

const meta = {
  title: 'Headless/IconListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
