import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"slovensko-rodne-cislo-view\"\n  aria-label=\"Slovak Personal Number\"\n></span>";

const meta = {
  title: 'Headless/Slovensko Rodne Cislo View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
