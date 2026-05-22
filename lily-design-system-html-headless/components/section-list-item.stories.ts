import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="section-list-item"
  aria-label=""
>
  <!-- Consumer provides content -->
</li>`;

const meta = {
  title: 'Headless/SectionListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
