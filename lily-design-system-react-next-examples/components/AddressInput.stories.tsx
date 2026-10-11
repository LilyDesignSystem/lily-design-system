import type { Meta, StoryObj } from '@storybook/react-vite';
import AddressInput from './AddressInput';

const meta = {
  title: 'Headless/AddressInput',
  component: AddressInput,
  tags: ['autodocs']
} satisfies Meta<typeof AddressInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
