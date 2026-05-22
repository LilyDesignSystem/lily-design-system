import type { Meta, StoryObj } from '@storybook/react-vite';
import ValidationList from './ValidationList';

const meta = {
  title: 'Headless/ValidationList',
  component: ValidationList,
  tags: ['autodocs']
} satisfies Meta<typeof ValidationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
