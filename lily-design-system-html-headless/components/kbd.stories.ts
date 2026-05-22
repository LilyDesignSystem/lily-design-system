import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<kbd
  class="kbd"
>
  <!-- Consumer provides key text -->
</kbd>`;

const meta = {
  title: 'Headless/Kbd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
