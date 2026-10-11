import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleGroup from './ToggleGroup';

const meta = {
  title: 'Headless/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
