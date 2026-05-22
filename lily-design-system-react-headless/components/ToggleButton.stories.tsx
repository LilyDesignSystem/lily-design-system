import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleButton from './ToggleButton';

const meta = {
  title: 'Headless/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs']
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
