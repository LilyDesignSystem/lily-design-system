import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="section-link"
  aria-label=""
>
  <!-- Consumer provides content -->
</a>`;

const meta = {
  title: 'Headless/SectionLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
