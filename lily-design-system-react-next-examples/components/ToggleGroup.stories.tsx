import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ToggleGroup from './ToggleGroup';

const meta = {
  title: 'Examples/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
