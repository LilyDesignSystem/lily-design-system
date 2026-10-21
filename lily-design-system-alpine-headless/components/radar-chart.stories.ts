import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RadarChart component -->\n<!--\n  Description: a headless wrapper for a chart plotting several axes from a shared centre as a polygon.\n    Wraps a consumer-supplied inline <svg>; no drawing happens here.\n  HTML tag: <figure> containing <div class=\"radar-chart-graphic\" role=\"img\">\n  CSS class: radar-chart (sub-elements: radar-chart-graphic, radar-chart-data-table)\n  Keyboard: None on the graphic; the data table follows native table behaviour\n  Accessibility: the graphic wrapper carries role=\"img\" and the required\n    consumer-supplied aria-label; aria-describedby (optional) references a text\n    description. The optional data table is a sibling of the graphic, outside\n    role=\"img\", so assistive technology can reach it.\n  Usage (see the markup below for the commented version):\n    <figure class=\"radar-chart\">\n        <div class=\"radar-chart-graphic\" role=\"img\" aria-label=\"Example\" aria-describedby=\"radar-chart-desc\">\n            <svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" cx=\"5\" cy=\"5\"></circle></svg>\n      </div>\n        <div class=\"radar-chart-data-table\">\n        <table>\n          <caption>Values</caption>\n          <tbody><tr><th scope=\"row\">A</th><td>1</td></tr></tbody>\n        </table>\n      </div>\n    </figure>\n    <p id=\"radar-chart-desc\">Example description</p>\n-->\n\n<figure class=\"radar-chart\">\n  <!-- role=\"img\" lives on the graphic wrapper, never on the figure: it makes\n       its descendants presentational, so a data table inside it would be\n       invisible to assistive technology. -->\n  <div class=\"radar-chart-graphic\" role=\"img\" aria-label=\"Example\" aria-describedby=\"radar-chart-desc\">\n    <!-- Consumer provides the inline svg; no drawing happens in this component. -->\n    <svg data-testid=\"art\" viewBox=\"0 0 10 10\"><circle r=\"4\" cx=\"5\" cy=\"5\"></circle></svg>\n  </div>\n  <!-- Optional accessible table alternative: a SIBLING of the graphic, outside role=\"img\". -->\n  <div class=\"radar-chart-data-table\">\n    <table>\n      <caption>Values</caption>\n      <tbody><tr><th scope=\"row\">A</th><td>1</td></tr></tbody>\n    </table>\n  </div>\n</figure>\n<!-- Optional short text description referenced by aria-describedby on the graphic -->\n<p id=\"radar-chart-desc\">Example description</p>";

const meta = {
  title: 'Headless/Radar Chart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
