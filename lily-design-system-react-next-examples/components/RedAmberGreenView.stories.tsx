import type { Meta, StoryObj } from '@storybook/react-vite';
import RedAmberGreenView from './RedAmberGreenView';

const meta = {
  title: 'Headless/RedAmberGreenView',
  component: RedAmberGreenView,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
