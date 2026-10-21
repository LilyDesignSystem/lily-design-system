import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EireIndividualHealthIdentifierView component -->\n<!--\n  Description: a read-only display of Eire IHI unique national healthcare identifier\n  HTML tag: <span>\n  CSS class: eire-individual-health-identifier-view\n  Usage:\n    <span class=\"eire-individual-health-identifier-view\" aria-label=\"IHI\">1234567890</span>\n-->\n\n<span\n  class=\"eire-individual-health-identifier-view\"\n  aria-label=\"IHI\"\n></span>";

const meta = {
  title: 'Headless/Eire Individual Health Identifier View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
