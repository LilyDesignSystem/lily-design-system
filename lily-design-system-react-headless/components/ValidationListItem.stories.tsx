import type { Meta, StoryObj } from '@storybook/react-vite';
import ValidationListItem from './ValidationListItem';

const meta = {
  title: 'Headless/ValidationListItem',
  component: ValidationListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ValidationListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
