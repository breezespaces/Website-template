import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CartItem = {
    name: string,
    price: number,
    imageUrl: string,
    quantity: number,
    color: string,
    size?: string
}

interface CartState {
    items: CartItem[]
    showAddToBagAlert: boolean;
}

const initialState: CartState = {
    items: [],
    showAddToBagAlert: false,
} 

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const isBag = action.payload.name.toLowerCase().includes('bag');
            const isSandal = action.payload.name.toLowerCase().includes('sandal');
            
            const hasBag = state.items.some(item => item.name.toLowerCase().includes('bag'));
            const hasSandal = state.items.some(item => item.name.toLowerCase().includes('sandal'));
            
            if ((isBag && hasSandal) || (isSandal && hasBag)) {
                return;
            }
            
            const existingItem = state.items.find(item => item.name === action.payload.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push(action.payload);
            }
            state.showAddToBagAlert = true;
        },

        resetAddToBagAlert: (state) => {
            state.showAddToBagAlert = false;
        },

        removeFromCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.name === action.payload.name);
            if (existingItem) {
                existingItem.quantity -= 1;
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter(item => item.name !== action.payload.name);
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
        },
        removeSandals: (state) => {
            state.items = state.items.filter(item => !item.name.toLowerCase().includes('sandal'));
        }
    }
})

export const { addToCart, removeFromCart, clearCart, removeSandals, resetAddToBagAlert } = cartSlice.actions;
export default cartSlice.reducer;