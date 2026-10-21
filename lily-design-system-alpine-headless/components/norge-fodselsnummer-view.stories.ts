import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"norge-fodselsnummer-view\"\n  aria-label=\"Norwegian Birth Number\"\n></span>";

const meta = {
  title: 'Headless/Norge Fodselsnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
