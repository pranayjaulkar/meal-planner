import { create } from "zustand";

type CreateMealModalStore = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useCreateMealModal = create<CreateMealModalStore>((set) => ({
  open: false,

  openModal: () =>
    set({
      open: true,
    }),

  closeModal: () =>
    set({
      open: false,
    }),
}));
