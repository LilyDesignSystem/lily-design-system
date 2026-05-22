import type { Meta, StoryObj } from '@storybook/react-vite';
import AngleSliderRangeInput from './AngleSliderRangeInput';

const meta = {
  title: 'Headless/AngleSliderRangeInput',
  component: AngleSliderRangeInput,
  tags: ['autodocs']
} satisfies Meta<typeof AngleSliderRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
