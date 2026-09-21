export type ListboxControllerOptions = {
  root: HTMLElement;
  clamp?: boolean;
  typeahead?: boolean;
  pageSize?: number;
  getOptionLabel?: (option: HTMLElement) => string;
  onActiveIndexChange: (index: number) => void;
  onActivate: (index: number) => void;
  onEscape: () => void;
  onTabOut: () => void;
};

export declare class ListboxController {
  constructor(options: ListboxControllerOptions);
  readonly activeIndex: number;
  setActiveIndex(index: number): void;
  destroy(): void;
}
