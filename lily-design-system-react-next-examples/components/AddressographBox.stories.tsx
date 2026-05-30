import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AddressographBox from './AddressographBox';

const meta = {
  title: 'Examples/AddressographBox',
  component: AddressographBox,
  tags: ['autodocs']
} satisfies Meta<typeof AddressographBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
