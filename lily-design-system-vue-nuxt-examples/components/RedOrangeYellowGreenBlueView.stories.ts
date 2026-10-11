import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.vue';

const meta = {
  title: 'Headless/RedOrangeYellowGreenBlueView',
  component: RedOrangeYellowGreenBlueView,
  tags: ['autodocs']
} satisfies Meta<typeof RedOrangeYellowGreenBlueView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
