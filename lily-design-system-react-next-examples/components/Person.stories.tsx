import type { Meta, StoryObj } from '@storybook/react-vite';
import Person from './Person';

const meta = {
  title: 'Headless/Person',
  component: Person,
  tags: ['autodocs']
} satisfies Meta<typeof Person>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
