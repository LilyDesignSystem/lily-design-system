import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GoToNextSection from './GoToNextSection.vue';

const meta = {
  title: 'Headless/GoToNextSection',
  component: GoToNextSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToNextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
