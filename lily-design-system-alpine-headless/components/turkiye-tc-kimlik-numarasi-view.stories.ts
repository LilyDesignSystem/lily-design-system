import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"turkiye-tc-kimlik-numarasi-view\"\n  aria-label=\"T.C. Kimlik Numarası\"\n></span>";

const meta = {
  title: 'Headless/Turkiye Tc Kimlik Numarasi View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
