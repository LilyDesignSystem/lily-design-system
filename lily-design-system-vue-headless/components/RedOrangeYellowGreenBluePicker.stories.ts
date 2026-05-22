import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.vue';

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePicker',
  component: RedOrangeYellowGreenBluePicker,
  tags: ['autodocs']
} satisfies Meta<typeof RedOrangeYellowGreenBluePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
