import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="section-nav"
  aria-label=""
>
  <!-- Consumer provides content -->
</nav>`;

const meta = {
  title: 'Headless/SectionNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
