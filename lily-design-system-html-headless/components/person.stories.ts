import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="person"
  aria-label=""
>
  <!-- Consumer provides content -->
</article>`;

const meta = {
  title: 'Headless/Person',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
