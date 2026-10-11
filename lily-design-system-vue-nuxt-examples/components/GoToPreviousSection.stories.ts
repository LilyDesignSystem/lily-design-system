import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GoToPreviousSection from './GoToPreviousSection.vue';

const meta = {
  title: 'Headless/GoToPreviousSection',
  component: GoToPreviousSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToPreviousSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
