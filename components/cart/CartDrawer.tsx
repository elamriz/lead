"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export const CartDrawer = () => {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-[60] bg-black/20"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-black">Cart ({items.length})</h2>
                            <button
                                onClick={toggleCart}
                                className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 border border-neutral-200 flex items-center justify-center">
                                        <X className="w-8 h-8 text-neutral-300" />
                                    </div>
                                    <p className="text-neutral-500">Your cart is empty.</p>
                                    <button onClick={toggleCart} className="px-6 py-2 border border-neutral-300 hover:border-black transition-colors text-sm">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-neutral-200">
                                        <div className="relative w-20 h-20 bg-neutral-100 flex-shrink-0">
                                            <div className="w-full h-full flex items-center justify-center text-xs text-center p-1 text-neutral-400">
                                                {item.name}
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium text-black line-clamp-1 text-sm">{item.name}</h4>
                                                <p className="text-sm text-neutral-600 mt-1">{item.price}€</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 border border-neutral-200 p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-neutral-100 text-neutral-600"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs w-4 text-center text-black">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-neutral-100 text-neutral-600"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-neutral-500 hover:text-black transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-neutral-200 bg-white mt-auto">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm text-neutral-600">
                                        <span>Subtotal</span>
                                        <span>{totalPrice().toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-medium text-black">
                                        <span>Total</span>
                                        <span>{totalPrice().toFixed(2)}€</span>
                                    </div>
                                    <p className="text-xs text-neutral-500">Shipping and taxes calculated at checkout.</p>
                                </div>

                                <Link href="/checkout" onClick={toggleCart} className="block w-full">
                                    <button className="w-full px-6 py-3 bg-black text-white text-sm hover:bg-neutral-800 transition-colors flex items-center justify-between group">
                                        Checkout
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
