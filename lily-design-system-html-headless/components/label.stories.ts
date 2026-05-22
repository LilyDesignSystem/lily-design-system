import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<label
  class="label"
>
  <!-- Consumer provides label text -->
</label>`;

const meta = {
  title: 'Headless/Label',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
