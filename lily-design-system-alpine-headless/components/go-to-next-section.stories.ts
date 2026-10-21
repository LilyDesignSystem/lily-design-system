import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GoToNextSection component -->\n<!--\n  Description: a link that takes users to the next section of the current page\n  HTML tag: <a>\n  CSS class: go-to-next-section\n-->\n\n<a class=\"go-to-next-section\" href=\"\" aria-label=\"\"></a>";

const meta = {
  title: 'Headless/Go To Next Section',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
