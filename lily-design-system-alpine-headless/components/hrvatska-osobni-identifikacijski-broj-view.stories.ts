import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"hrvatska-osobni-identifikacijski-broj-view\"\n  aria-label=\"Personal Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Hrvatska Osobni Identifikacijski Broj View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
