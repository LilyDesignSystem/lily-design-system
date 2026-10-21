import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"italia-codice-fiscale-view\"\n  aria-label=\"Italian Fiscal Code\"\n></span>";

const meta = {
  title: 'Headless/Italia Codice Fiscale View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
