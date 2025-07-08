"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../../assets/assets";
import Loading from "../../../components/Loading";
import Footer from "../../../components/seller/Footer";
import { useAppContext } from "../../../context/AppContext";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/product/seller_list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
        toast.success("Seller_list fetched successfully!");
      } else {
        toast.error(data.message || "Failed to fetch products.");
      }
    } catch (err) {
      toast.error("Failed to fetch products. Please try again later.");
    }
  };

  const handleEdit = (productId) => {
    router.push(`/seller/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }

      setDeletingId(productId);
      const token = await getToken();

      const { data } = await axios.delete(
        `/api/product/seller_list/product?id=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Product deleted successfully");
        // Refresh the product list
        await fetchSellerProduct();
      } else {
        toast.error(data.message || "Failed to delete product.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Product</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className=" table-auto w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3 max-sm:hidden flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Edit</span>
                        <Image
                          className="h-3.5"
                          src="/edit.svg"
                          alt="redirect_icon"
                          width={20}
                          height={200}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className={`flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                          deletingId === product._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="hidden md:block">
                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </span>
                        <Image
                          className="h-3.5"
                          src="/delete.svg"
                          alt="delete_icon"
                          width={20}
                          height={200}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
