import type { Meta, StoryObj } from '@storybook/react-vite';
import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView';

const meta = {
  title: 'Headless/RedOrangeYellowGreenBlueView',
  component: RedOrangeYellowGreenBlueView,
  tags: ['autodocs']
} satisfies Meta<typeof RedOrangeYellowGreenBlueView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
