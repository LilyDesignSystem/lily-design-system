import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="validation-list"
  aria-label=""
  aria-live="polite"
>
  <!-- Consumer provides <li class="validation-list-item"> children -->
</ul>`;

const meta = {
  title: 'Headless/ValidationList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
