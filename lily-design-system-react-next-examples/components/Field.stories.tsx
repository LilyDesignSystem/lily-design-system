import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Field from './Field';

const meta = {
  title: 'Examples/Field',
  component: Field,
  tags: ['autodocs']
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
