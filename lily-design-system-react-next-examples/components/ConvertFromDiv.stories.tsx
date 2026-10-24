import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertFromDiv from './ConvertFromDiv';

const meta = {
  title: 'Headless/ConvertFromDiv',
  component: ConvertFromDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertFromDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
