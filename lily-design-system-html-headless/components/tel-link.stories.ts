import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="tel-link"
  aria-label=""
  href="tel:"
>
  <!-- Consumer provides link text -->
</a>`;

const meta = {
  title: 'Headless/TelLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
