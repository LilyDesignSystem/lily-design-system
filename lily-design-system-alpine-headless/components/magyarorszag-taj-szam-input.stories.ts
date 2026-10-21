import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"magyarorszag-taj-szam-input\"\n  type=\"text\"\n  aria-label=\"Társadalombiztosítási Azonosító Jel (TAJ)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Magyarorszag Taj Szam Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
