import type { Meta, StoryObj } from '@storybook/react-vite';
import SliderButton from './SliderButton';

const meta = {
  title: 'Headless/SliderButton',
  component: SliderButton,
  tags: ['autodocs']
} satisfies Meta<typeof SliderButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
