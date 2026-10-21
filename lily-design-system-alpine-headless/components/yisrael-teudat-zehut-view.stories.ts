import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"yisrael-teudat-zehut-view\"\n  aria-label=\"Teudat Zehut (תעודת זהות)\"\n></span>";

const meta = {
  title: 'Headless/Yisrael Teudat Zehut View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
