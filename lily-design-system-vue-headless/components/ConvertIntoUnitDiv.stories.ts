import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertIntoUnitDiv from './ConvertIntoUnitDiv.vue';

const meta = {
  title: 'Headless/ConvertIntoUnitDiv',
  component: ConvertIntoUnitDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoUnitDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
