import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Pictogram from './Pictogram.vue';

const meta = {
  title: 'Examples/Pictogram',
  component: Pictogram,
  tags: ['autodocs']
} satisfies Meta<typeof Pictogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
