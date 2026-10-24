import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertFromUnitDiv from './ConvertFromUnitDiv.vue';

const meta = {
  title: 'Headless/ConvertFromUnitDiv',
  component: ConvertFromUnitDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertFromUnitDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
