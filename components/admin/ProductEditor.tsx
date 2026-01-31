"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { X, Plus, Trash2, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface ProductEditorProps {
    product?: Product | null; // If null, we are creating
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export function ProductEditor({ product, isOpen, onClose, onSaved }: ProductEditorProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        category: "PC",
        price: 0,
        originalPrice: 0,
        image: "",
        description: "",
        specs: {},
        isNew: false
    });

    const [specList, setSpecList] = useState<{ key: string, value: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData(product);
                // Convert specs object to array for easier editing
                const specsArray = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value }));
                setSpecList(specsArray);
            } else {
                // Reset for new product
                setFormData({
                    name: "",
                    category: "PC",
                    price: 0,
                    image: "",
                    description: "",
                    specs: {},
                    isNew: true
                });
                setSpecList([]);
            }
        }
    }, [isOpen, product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else if (type === 'checkbox') {
            // Cast to input element to access checked
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specList];
        newSpecs[index][field] = value;
        setSpecList(newSpecs);
    };

    const addSpec = () => {
        setSpecList([...specList, { key: "", value: "" }]);
    };

    const removeSpec = (index: number) => {
        setSpecList(specList.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Reconstruct specs object
            const specsObj: Record<string, string> = {};
            specList.forEach(item => {
                if (item.key.trim()) {
                    specsObj[item.key] = item.value;
                }
            });

            const dataToSave = {
                ...formData,
                specs: specsObj
            };

            // Prepare payload for Supabase (matching exact DB column names if different)
            // Based on previous files, DB columns are snake_case: original_price, is_new
            const dbPayload = {
                name: dataToSave.name,
                category: dataToSave.category,
                price: dataToSave.price,
                original_price: dataToSave.originalPrice || null,
                image: dataToSave.image?.trim() || "", // Ensure string
                description: dataToSave.description,
                specs: dataToSave.specs,
                is_new: dataToSave.isNew
            };

            console.log("Submitting payload:", dbPayload);

            if (product?.id) {
                console.log("Updating product with ID:", product.id);
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(dbPayload)
                    .eq('id', product.id);

                if (error) {
                    console.error("Supabase Update Error:", error);
                    throw error;
                }

            } else {
                console.log("Creating new product");
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert([dbPayload]);

                if (error) {
                    console.error("Supabase Insert Error:", error);
                    throw error;
                }
            }

            console.log("Operation successful");
            onSaved();
            onClose();
        } catch (error: any) {
            console.error("Detailed Error saving product:", error);
            alert(`Failed to save product: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1d1d1f]">
                                        {product ? "Edit Product" : "New Product"}
                                    </h2>
                                    <p className="text-neutral-500 text-sm">
                                        Fill in the details below to {product ? "update this" : "create a"} product.
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-neutral-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider border-b pb-2">Basic Info</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                                            <input
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                                                placeholder="e.g. MacBook Pro M3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all bg-white"
                                            >
                                                <option value="Laptop">Laptop</option>
                                                <option value="PC">PC</option>
                                                <option value="Component">Component</option>
                                                <option value="Accessory">Accessory</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center pt-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="isNew"
                                                    checked={formData.isNew}
                                                    onChange={handleChange} // This needs explicit handling in handleChange
                                                    className="w-5 h-5 rounded border-neutral-300 text-[#0071e3] focus:ring-[#0071e3]"
                                                />
                                                <span className="text-sm font-medium text-neutral-700">Mark as New Arrival</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Price (€)</label>
                                            <input
                                                required
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Original Price (€) <span className="text-neutral-400 font-normal">(Optional)</span></label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={formData.originalPrice || ""}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Media & Description */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider border-b pb-2">Content</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                                                <input
                                                    required
                                                    name="image"
                                                    value={formData.image}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        {formData.image && (
                                            <div className="mt-2 text-xs text-neutral-500">
                                                Preview: <img src={formData.image} alt="Preview" className="h-20 w-auto object-cover rounded-md inline-block ml-2 border" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                                        <textarea
                                            required
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all resize-none"
                                            placeholder="Product description..."
                                        />
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Specifications</h3>
                                        <button
                                            type="button"
                                            onClick={addSpec}
                                            className="flex items-center text-xs font-semibold text-[#0071e3] hover:text-[#0077ed]"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Spec
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {specList.map((spec, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    placeholder="Key (e.g. CPU)"
                                                    value={spec.key}
                                                    onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                                    className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#0071e3] transition-all"
                                                />
                                                <input
                                                    placeholder="Value (e.g. M3 Max)"
                                                    value={spec.value}
                                                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                                    className="flex-[2] rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#0071e3] transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpec(index)}
                                                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {specList.length === 0 && (
                                            <p className="text-sm text-neutral-400 italic text-center py-4 bg-neutral-50 rounded-lg">
                                                No specifications added yet.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-safe">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        {product ? "Save Changes" : "Create Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
