import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"rossiya-snils-view\"\n  aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\"\n></span>";

const meta = {
  title: 'Headless/Rossiya Snils View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
