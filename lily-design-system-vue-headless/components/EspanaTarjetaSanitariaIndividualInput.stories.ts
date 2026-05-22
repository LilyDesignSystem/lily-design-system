import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EspanaTarjetaSanitariaIndividualInput from './EspanaTarjetaSanitariaIndividualInput.vue';

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualInput',
  component: EspanaTarjetaSanitariaIndividualInput,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaTarjetaSanitariaIndividualInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
