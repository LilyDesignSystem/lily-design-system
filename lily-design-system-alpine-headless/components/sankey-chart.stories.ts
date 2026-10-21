import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<figure class=\"sankey-chart\">\n  <!-- role=\"img\" lives on the graphic wrapper, never on the figure: it makes\n       its descendants presentational, so a data table inside it would be\n       invisible to assistive technology. -->\n  <div class=\"sankey-chart-graphic\" role=\"img\" aria-label=\"Example\" aria-describedby=\"sankey-chart-desc\">\n    <!-- Consumer provides the inline svg; no drawing happens in this component. -->\n    <svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" cx=\"5\" cy=\"5\"></circle></svg>\n  </div>\n  <!-- Optional accessible table alternative: a SIBLING of the graphic, outside role=\"img\". -->\n  <div class=\"sankey-chart-data-table\">\n    <table>\n      <caption>Values</caption>\n      <tbody><tr><th scope=\"row\">A</th><td>1</td></tr></tbody>\n    </table>\n  </div>\n</figure>\n<!-- Optional short text description referenced by aria-describedby on the graphic -->\n<p id=\"sankey-chart-desc\">Example description</p>";

const meta = {
  title: 'Headless/Sankey Chart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
