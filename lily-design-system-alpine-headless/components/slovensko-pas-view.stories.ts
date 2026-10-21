import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"slovensko-pas-view\"\n  aria-label=\"Slovak Passport\"\n></span>";

const meta = {
  title: 'Headless/Slovensko Pas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
