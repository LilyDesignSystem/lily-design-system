import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"polska-numer-identyfikacji-podatkowej-view\"\n  aria-label=\"Tax Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Polska Numer Identyfikacji Podatkowej View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
