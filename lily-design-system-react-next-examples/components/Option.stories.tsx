import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Option from './Option';

const meta = {
  title: 'Examples/Option',
  component: Option,
  tags: ['autodocs']
} satisfies Meta<typeof Option>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
