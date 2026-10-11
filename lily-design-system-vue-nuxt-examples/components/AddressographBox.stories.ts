import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AddressographBox from './AddressographBox.vue';

const meta = {
  title: 'Headless/AddressographBox',
  component: AddressographBox,
  tags: ['autodocs']
} satisfies Meta<typeof AddressographBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
