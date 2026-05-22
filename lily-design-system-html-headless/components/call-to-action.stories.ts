import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="call-to-action"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/CallToAction',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
