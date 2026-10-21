import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Affix component -->\n<!--\n  Description: a wrapper that pins its content to a viewport position while the page scrolls\n\n  HTML tag: <div>\n  CSS class: affix\n  Keyboard: None (passive layout container)\n  Accessibility: None — purely structural; no role or ARIA attributes are added.\n\n  Behavior:\n    Renders a <div class=\"affix\"> with inline style \"position: sticky;\"\n    plus either \"top: {offsetTop}px\" or \"bottom: {offsetBottom}px\" to pin\n    the element relative to its scroll container. If neither offset is given,\n    the default is \"top: 0\".\n\n    The numeric offsets are also exposed via data-offset-top and\n    data-offset-bottom attributes so consumers can hook CSS or JS as needed.\n\n  Inline style use:\n    Inline \"style=\" is permitted here ONLY because position: sticky is the\n    documented headless behavior of this component (per the spec). All visual\n    styling beyond positioning must come from consumer CSS.\n\n  Usage:\n    <div class=\"affix\" style=\"position: sticky; top: 0;\" data-offset-top=\"0\">\n      ...content to pin...\n    </div>\n\n    <div class=\"affix\" style=\"position: sticky; bottom: 16px;\" data-offset-bottom=\"16\">\n      ...content to pin to the bottom...\n    </div>\n-->\n\n<div\n  class=\"affix\"\n  style=\"position: sticky; top: 0;\"\n  data-offset-top=\"0\"\n>\n  <!-- Consumer provides the content to be pinned to the viewport -->\n</div>";

const meta = {
  title: 'Headless/Affix',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
