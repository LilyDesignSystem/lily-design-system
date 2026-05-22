import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="grail-layout-left-aside"></aside>`;

const meta = {
  title: 'Headless/GrailLayoutLeftAside',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
