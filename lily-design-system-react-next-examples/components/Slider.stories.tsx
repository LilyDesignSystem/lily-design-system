import type { Meta, StoryObj } from '@storybook/react-vite';
import Slider from './Slider';

const meta = {
  title: 'Headless/Slider',
  component: Slider,
  tags: ['autodocs']
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
