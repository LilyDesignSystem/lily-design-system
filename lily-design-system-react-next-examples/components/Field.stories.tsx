import type { Meta, StoryObj } from '@storybook/react-vite';
import Field from './Field';

const meta = {
  title: 'Headless/Field',
  component: Field,
  tags: ['autodocs']
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
