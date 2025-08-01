"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../../../../assets/assets";
import { useAppContext } from "../../../../../context/AppContext";

const EditProduct = ({ params }) => {
  const { getToken } = useAppContext();
  const router = useRouter();
  const { id } = params;

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `/api/product/seller_list/product?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success && data.product) {
          const product = data.product;
          setName(product.name);
          setDescription(product.description);
          setCategory(product.category);
          setPrice(product.price);
          setOfferPrice(product.offerPrice);
          setColors(product.colors || []);
          setExistingImages(product.image || []);
          setLoading(false);
        } else {
          toast.error("Product not found");
          router.push("/seller/product-list");
        }
      } catch (err) {
        toast.error("Failed to fetch product");
        router.push("/seller/product-list");
      }
    };

    fetchProduct();
  }, [id, getToken, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    colors.forEach((color) => formData.append("color", color));
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const token = await getToken();

      const { data } = await axios.put(
        "/api/product/seller_list/product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        "An error occurred while adding the product. Please try again."
      );
      console.error("Error updating product:", err);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Display existing images */}
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative">
                <Image
                  className="max-w-24"
                  src={image}
                  alt=""
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Display upload areas for new images */}
            {[...Array(4 - existingImages.length)].map((_, index) => (
              <label key={`new-${index}`} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setColors([...colors, currentColor])}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Add Color
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-500"
                style={{ backgroundColor: c }}
              />
              <button
                type="button"
                onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          Update
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default EditProduct;
