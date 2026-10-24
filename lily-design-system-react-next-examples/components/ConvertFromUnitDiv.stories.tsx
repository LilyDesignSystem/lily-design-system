import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertFromUnitDiv from './ConvertFromUnitDiv';

const meta = {
  title: 'Headless/ConvertFromUnitDiv',
  component: ConvertFromUnitDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertFromUnitDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
