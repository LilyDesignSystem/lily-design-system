import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemePicker from './ThemePicker';

const meta = {
  title: 'Headless/ThemePicker',
  component: ThemePicker,
  tags: ['autodocs']
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
