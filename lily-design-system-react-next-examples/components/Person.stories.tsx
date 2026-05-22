import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Person from './Person';

const meta = {
  title: 'Examples/Person',
  component: Person,
  tags: ['autodocs']
} satisfies Meta<typeof Person>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
