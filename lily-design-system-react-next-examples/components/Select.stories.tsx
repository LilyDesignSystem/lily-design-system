import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

const meta = {
  title: 'Headless/Select',
  component: Select,
  tags: ['autodocs']
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
