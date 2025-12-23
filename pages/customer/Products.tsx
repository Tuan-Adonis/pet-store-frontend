import React, { useState, useEffect } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { useCategory } from "../../contexts/CategoryContext";
import { useBreed } from "../../contexts/BreedContext";
import { useOrigin } from "../../contexts/OriginContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotification } from "../../contexts/NotificationContext";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  MapPin,
  Calendar,
  Info,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CustomerProducts: React.FC = () => {
  const { products, refreshProducts } = useProduct();
  const { addToCart } = useCart();
  const { breeds: allBreeds } = useBreed();
  const { origins: allOrigins } = useOrigin();
  const { categories: allCategories } = useCategory();

  const { user } = useAuth();
  const { formatCurrency } = useLanguage();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [origin, setOrigin] = useState<string[]>([]);
  const [breedFilter, setBreedFilter] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Call API on mount to get latest data
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setCategory([catParam]);
    }
  }, [searchParams]);

  // Derived filters based on selection (e.g. only show breeds belonging to selected category AND status = 1)
  const availableBreeds = allBreeds.filter(
    (b) =>
      b.status === 1 &&
      (category.length === 0 ||
        (b.categoryCode && category.includes(b.categoryCode)))
  );

  const filteredProducts = products.filter((p) => {
    const fullSearchText = `${p.name} ${p.breed} ${p.category}`.toLowerCase();
    const matchesSearch = fullSearchText.includes(searchTerm.toLowerCase());
    const matchesCategory =
      category.length === 0 || (p.category && category.includes(p.category));
    const matchesOrigin =
      origin.length === 0 || (p.origin && origin.includes(p.origin));
    const matchesBreed =
      breedFilter.length === 0 || (p.breed && breedFilter.includes(p.breed));

    let matchesAge = true;
    if (ageRange === "baby") matchesAge = (p.age || 0) < 6;
    else if (ageRange === "junior")
      matchesAge = (p.age || 0) >= 6 && (p.age || 0) <= 12;
    else if (ageRange === "adult") matchesAge = (p.age || 0) > 12;

    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesOrigin &&
      matchesBreed &&
      matchesAge &&
      matchesPrice
    );
  });

  const handleAddToCart = (productId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    const success = addToCart(productId, 1);
    if (success) {
      notify("success", "Đã thêm thú cưng vào giỏ hàng");
    } else {
      notify("info", "Thú cưng này đã có trong giỏ hàng của bạn");
    }
  };

  const toggleCategory = (catCode: string) => {
    setCategory((prev) =>
      prev.includes(catCode)
        ? prev.filter((c) => c !== catCode)
        : [...prev, catCode]
    );
    // Clear breed filter if category changes as breeds might not belong to new category
    setBreedFilter([]);
  };

  const toggleOrigin = (org: string) => {
    setOrigin((prev) =>
      prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]
    );
  };

  const toggleBreed = (brd: string) => {
    setBreedFilter((prev) =>
      prev.includes(brd) ? prev.filter((b) => b !== brd) : [...prev, brd]
    );
  };

  const getCategoryName = (code: string) =>
    allCategories.find((c) => c.code === code)?.name || code;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium"
        >
          <Filter size={20} /> Bộ lọc
        </button>
        <span className="text-gray-500 text-sm">
          {filteredProducts.length} kết quả
        </span>
      </div>

      <div
        className={`
        fixed inset-0 bg-black/50 z-50 transition-opacity lg:static lg:bg-transparent lg:z-auto lg:w-64 lg:block
        ${
          isFilterOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible lg:opacity-100 lg:visible"
        }
      `}
      >
        <div
          className={`
          bg-white h-full w-80 lg:w-full p-6 lg:p-0 overflow-y-auto transform transition-transform lg:transform-none lg:shadow-none shadow-2xl
          ${
            isFilterOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h2 className="text-xl font-bold">Bộ Lọc</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 lg:bg-white lg:rounded-xl lg:p-6 lg:shadow-sm lg:border lg:border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Tìm kiếm</h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Danh mục loài</h3>
              <div className="space-y-2">
                {allCategories
                  .filter((c) => c.status === 1)
                  .map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={category.includes(cat.code)}
                        onChange={() => toggleCategory(cat.code)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm">
                        {cat.name}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Giống</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {availableBreeds.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={breedFilter.includes(b.name)}
                      onChange={() => toggleBreed(b.name)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm">{b.name}</span>
                  </label>
                ))}
                {availableBreeds.length === 0 && (
                  <span className="text-gray-400 text-xs italic">
                    Chưa có dữ liệu giống cho danh mục này
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Nguồn giống</h3>
              <div className="space-y-2">
                {allOrigins
                  .filter((o) => o.status === 1)
                  .map((org) => (
                    <label
                      key={org.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={origin.includes(org.name)}
                        onChange={() => toggleOrigin(org.name)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm">
                        {org.name}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Độ tuổi</h3>
              <div className="space-y-2">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "baby", label: "Nhỏ (< 6 tháng)" },
                  { id: "junior", label: "Nhỡ (6-12 tháng)" },
                  { id: "adult", label: "Trưởng thành (> 1 tuổi)" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="age"
                      checked={ageRange === opt.id}
                      onChange={() => setAgeRange(opt.id)}
                      className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Khoảng giá</h3>
              <div className="flex flex-col space-y-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setCategory([]);
                setOrigin([]);
                setBreedFilter([]);
                setAgeRange("all");
                setSearchTerm("");
                setPriceRange([0, 50000000]);
              }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-6 hidden lg:flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Danh sách thú cưng
          </h1>
          <span className="text-gray-500">
            {filteredProducts.length} kết quả phù hợp
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
            <Info size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy thú cưng nào phù hợp với bộ lọc của bạn.
            </p>
            <button
              onClick={() => {
                setCategory([]);
                setOrigin([]);
                setBreedFilter([]);
                setAgeRange("all");
                setSearchTerm("");
              }}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Xóa bộ lọc và thử lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isInactive = product.status === 0;
              return (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
                    isInactive ? "opacity-75 grayscale-[0.5]" : ""
                  }`}
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {isInactive && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                          Đã bán / Tạm ngưng
                        </span>
                      )}
                      {product.origin && !isInactive && (
                        <span className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                          <MapPin size={10} /> {product.origin}
                        </span>
                      )}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getCategoryName(product.category || "")} -{" "}
                      {product.breed}
                    </h3>
                    <div className="text-indigo-600 font-medium mb-3">
                      {product.name}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <Calendar size={12} /> {product.age} tháng
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {product.gender === 1 ? "Đực" : "Cái"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow border-t border-gray-50 pt-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-extrabold text-indigo-700">
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={isInactive}
                        className={`
                             px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-md flex items-center gap-2
                             ${
                               isInactive
                                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                 : "bg-gray-900 text-white hover:bg-indigo-600 active:bg-indigo-700"
                             }
                          `}
                      >
                        <ShoppingCart size={16} />{" "}
                        {isInactive ? "Đã bán" : "Thêm"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
