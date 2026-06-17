import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="theme-select-button"
  aria-label=""
  type="button"
  aria-pressed="false"
>
  <!-- Consumer provides content -->
</button>`;

const meta = {
  title: 'Headless/ThemeSelectButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
