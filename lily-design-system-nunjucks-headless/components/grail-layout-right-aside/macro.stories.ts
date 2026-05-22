import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="grail-layout-right-aside"></aside>`;

const meta = {
  title: 'Headless/GrailLayoutRightAside',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
