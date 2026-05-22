import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="go-to-top"
  aria-label=""
>
  <!-- Consumer provides content -->
</a>`;

const meta = {
  title: 'Headless/GoToTop',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
