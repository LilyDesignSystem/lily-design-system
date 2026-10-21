import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"cesko-cestovni-pas-view\"\n  aria-label=\"Czech Passport\"\n></span>";

const meta = {
  title: 'Headless/Cesko Cestovni Pas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
