import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset class="numeric-rating-scale-picker"><legend class="numeric-rating-scale-picker-legend">How bad is your pain now?</legend><span class="numeric-rating-scale-picker-min-label" id="nrs-demo-min">No pain</span><span class="numeric-rating-scale-picker-options"><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="0" aria-describedby="nrs-demo-min"> 0</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="1"> 1</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="2"> 2</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="3"> 3</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="4"> 4</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="5"> 5</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="6"> 6</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="7"> 7</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="8"> 8</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="9"> 9</label><label class="numeric-rating-scale-picker-option"><input type="radio" name="pain" value="10" aria-describedby="nrs-demo-max"> 10</label></span><span class="numeric-rating-scale-picker-max-label" id="nrs-demo-max">Worst pain imaginable</span></fieldset>';

const meta = {
    title: "Headless/Numeric Rating Scale Picker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
