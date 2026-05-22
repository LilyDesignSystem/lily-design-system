import type { Meta, StoryObj } from '@storybook/react-vite';
import SwitchButton from './SwitchButton';

const meta = {
  title: 'Headless/SwitchButton',
  component: SwitchButton,
  tags: ['autodocs']
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
