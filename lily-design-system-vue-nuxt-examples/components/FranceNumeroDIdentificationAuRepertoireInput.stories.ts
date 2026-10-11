import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FranceNumeroDIdentificationAuRepertoireInput from './FranceNumeroDIdentificationAuRepertoireInput.vue';

const meta = {
  title: 'Headless/FranceNumeroDIdentificationAuRepertoireInput',
  component: FranceNumeroDIdentificationAuRepertoireInput,
  tags: ['autodocs']
} satisfies Meta<typeof FranceNumeroDIdentificationAuRepertoireInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
