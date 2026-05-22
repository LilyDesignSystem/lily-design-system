import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BodyText from './BodyText.vue';

const meta = {
  title: 'Headless/BodyText',
  component: BodyText,
  tags: ['autodocs']
} satisfies Meta<typeof BodyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
