import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"yisrael-teudat-zehut-input\"\n  type=\"text\"\n  aria-label=\"Teudat Zehut (תעודת זהות)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Yisrael Teudat Zehut Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
