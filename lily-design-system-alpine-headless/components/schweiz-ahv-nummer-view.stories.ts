import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"schweiz-ahv-nummer-view\"\n  aria-label=\"AHV-Nummer / Numéro AVS\"\n></span>";

const meta = {
  title: 'Headless/Schweiz Ahv Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
