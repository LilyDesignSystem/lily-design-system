import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertIntoUnitDiv from './ConvertIntoUnitDiv';

const meta = {
  title: 'Headless/ConvertIntoUnitDiv',
  component: ConvertIntoUnitDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoUnitDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
