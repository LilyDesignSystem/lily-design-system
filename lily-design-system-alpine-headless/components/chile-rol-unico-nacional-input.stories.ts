import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"chile-rol-unico-nacional-input\"\n  type=\"text\"\n  aria-label=\"Rol Único Nacional (RUN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Chile Rol Unico Nacional Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
