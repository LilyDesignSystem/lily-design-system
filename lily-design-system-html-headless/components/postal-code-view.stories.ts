import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="postal-code-view"
  aria-label=""
>
  <!-- Consumer provides text content -->
</span>`;

const meta = {
  title: 'Headless/PostalCodeView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
