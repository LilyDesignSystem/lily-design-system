import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<main
  class="grail-layout-center-main"
  aria-label=""
>
  <!-- Consumer provides content -->
</main>`;

const meta = {
  title: 'Headless/GrailLayoutCenterMain',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
