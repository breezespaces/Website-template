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
            // Check if the item to add is a bag or sandal
            const isBag = action.payload.name.toLowerCase().includes('bag');
            const isSandal = action.payload.name.toLowerCase().includes('sandal');
            
            // Check if there's already a bag or sandal in the cart
            const hasBag = state.items.some(item => item.name.toLowerCase().includes('bag'));
            const hasSandal = state.items.some(item => item.name.toLowerCase().includes('sandal'));
            
            // Prevent adding bag if sandal exists and vice versa
            if ((isBag && hasSandal) || (isSandal && hasBag)) {
                // alert('You cannot have both a bag and sandal in your cart at the same time.');
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