import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"convert-div\" role=\"group\" aria-label=\"Currency converter\">100 US dollars</div>";

const meta = {
  title: 'Headless/ConvertDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
