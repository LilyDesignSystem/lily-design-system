import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"osterreich-sozialversicherungsnummer-view\"\n  aria-label=\"Sozialversicherungsnummer (SVNR)\"\n></span>";

const meta = {
  title: 'Headless/Osterreich Sozialversicherungsnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
