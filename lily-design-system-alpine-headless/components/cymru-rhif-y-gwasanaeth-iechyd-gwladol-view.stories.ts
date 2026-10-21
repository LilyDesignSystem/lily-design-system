import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-view\"\n  aria-label=\"National Health Service Number\"\n></span>";

const meta = {
  title: 'Headless/Cymru Rhif YGwasanaeth Iechyd Gwladol View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
