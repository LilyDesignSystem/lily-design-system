import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"magyarorszag-taj-szam-view\"\n  aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\"\n></span>";

const meta = {
  title: 'Headless/Magyarorszag Taj Szam View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
