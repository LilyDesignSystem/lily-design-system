import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="section-list"
  aria-label=""
>
  <!-- Consumer provides content -->
</ul>`;

const meta = {
  title: 'Headless/SectionList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
