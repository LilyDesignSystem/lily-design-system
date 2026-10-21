import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"nederland-identiteitskaart-nummer-view\"\n  aria-label=\"Dutch National Identity Card Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Identiteitskaart Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
