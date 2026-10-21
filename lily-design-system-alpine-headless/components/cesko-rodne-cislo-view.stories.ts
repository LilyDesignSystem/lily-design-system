import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"cesko-rodne-cislo-view\"\n  aria-label=\"Czech Personal Number\"\n></span>";

const meta = {
  title: 'Headless/Cesko Rodne Cislo View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
