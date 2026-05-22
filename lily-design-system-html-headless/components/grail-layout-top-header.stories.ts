import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<header
  class="grail-layout-top-header"
  aria-label=""
>
  <!-- Consumer provides content -->
</header>`;

const meta = {
  title: 'Headless/GrailLayoutTopHeader',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
