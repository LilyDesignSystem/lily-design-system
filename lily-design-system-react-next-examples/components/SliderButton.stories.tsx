import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SliderButton from './SliderButton';

const meta = {
  title: 'Examples/SliderButton',
  component: SliderButton,
  tags: ['autodocs']
} satisfies Meta<typeof SliderButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
