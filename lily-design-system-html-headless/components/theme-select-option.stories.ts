import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<option
  class="theme-select-option"
>
  <!-- Consumer provides option text -->
</option>`;

const meta = {
  title: 'Headless/ThemeSelectOption',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
