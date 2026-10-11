import type { Meta, StoryObj } from '@storybook/react-vite';
import AddressographBox from './AddressographBox';

const meta = {
  title: 'Headless/AddressographBox',
  component: AddressographBox,
  tags: ['autodocs']
} satisfies Meta<typeof AddressographBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
