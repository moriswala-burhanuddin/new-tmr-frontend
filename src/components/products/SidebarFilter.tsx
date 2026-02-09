import { X } from "lucide-react";
import type { Brand, Category } from "../../types";

interface SidebarFilterProps {
    brands: Brand[];
    categories: Category[];
    selectedBrand: string | null;
    selectedCategories: string[];
    onSelectBrand: (brandId: string | null) => void;
    onSelectCategories: (categorySlugs: string[]) => void;
}

const SidebarFilter = ({
    brands,
    categories,
    selectedBrand,
    selectedCategories,
    onSelectBrand,
    onSelectCategories
}: SidebarFilterProps) => {
    const handleCategoryToggle = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            onSelectCategories(selectedCategories.filter(s => s !== slug));
        } else {
            onSelectCategories([...selectedCategories, slug]);
        }
    };

    return (
        <div className="bg-[#1A1A1A] p-8 border border-[#333] lg:sticky lg:top-24 shadow-2xl">
            {/* Screw Accents */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#111] border border-[#444]"></div>
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#111] border border-[#444]"></div>

            <h3 className="font-bold text-2xl mb-8 text-white uppercase tracking-tighter font-display border-b border-[#333] pb-4">
                Refine <span className="text-[#C41E3A]">Gear</span>
            </h3>

            {/* Categories */}
            <div className="mb-10">
                <h4 className="font-bold text-xs text-[#AAAAAA] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C41E3A]"></span> Categories
                </h4>
                <div className="space-y-1">
                    <button
                        onClick={() => onSelectCategories([])}
                        className={`block text-xs w-full text-left py-2.5 px-4 transition-all uppercase font-bold tracking-wider ${selectedCategories.length === 0 ? 'bg-[#C41E3A] text-white' : 'text-[#666] hover:text-white hover:bg-[#222]'}`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryToggle(cat.slug)}
                            className={`block text-xs w-full text-left py-2.5 px-4 transition-all uppercase font-bold tracking-wider ${selectedCategories.includes(cat.slug) ? 'bg-[#C41E3A] text-white' : 'text-[#666] hover:text-white hover:bg-[#222]'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{cat.name}</span>
                                {selectedCategories.includes(cat.slug) && <X className="w-3 h-3" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div>
                <h4 className="font-bold text-xs text-[#AAAAAA] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C41E3A]"></span> Brands
                </h4>
                <div className="space-y-1">
                    <button
                        onClick={() => onSelectBrand(null)}
                        className={`block text-xs w-full text-left py-2.5 px-4 transition-all uppercase font-bold tracking-wider ${selectedBrand === null ? 'bg-[#C41E3A] text-white' : 'text-[#666] hover:text-white hover:bg-[#222]'}`}
                    >
                        All Brands
                    </button>
                    {brands.map((brand) => (
                        <button
                            key={brand.id}
                            onClick={() => onSelectBrand(brand.id.toString())}
                            className={`block text-xs w-full text-left py-2.5 px-4 transition-all uppercase font-bold tracking-wider ${selectedBrand === brand.id.toString() ? 'bg-[#C41E3A] text-white' : 'text-[#666] hover:text-white hover:bg-[#222]'}`}
                        >
                            {brand.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-12 h-1 bg-[repeating-linear-gradient(45deg,#333,#333_5px,#C41E3A_5px,#C41E3A_10px)]"></div>
        </div>
    );
};

export default SidebarFilter;
