import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PinInputDiv from './PinInputDiv.vue';

const meta = {
  title: 'Headless/PinInputDiv',
  component: PinInputDiv,
  tags: ['autodocs']
} satisfies Meta<typeof PinInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
