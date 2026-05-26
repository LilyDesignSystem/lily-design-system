import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EspanaCodigoDeIdentificacionFiscalView from './EspanaCodigoDeIdentificacionFiscalView.vue';

const meta = {
  title: 'Headless/EspanaCodigoDeIdentificacionFiscalView',
  component: EspanaCodigoDeIdentificacionFiscalView,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaCodigoDeIdentificacionFiscalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EspanaCodigoDeIdentificacionFiscalView' }
};
