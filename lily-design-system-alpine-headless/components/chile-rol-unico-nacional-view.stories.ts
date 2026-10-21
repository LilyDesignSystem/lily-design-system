import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"chile-rol-unico-nacional-view\"\n  aria-label=\"Rol Único Nacional (RUN)\"\n></span>";

const meta = {
  title: 'Headless/Chile Rol Unico Nacional View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
