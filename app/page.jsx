"use client";
import Banner from "../components/Banner";
import FeaturedProduct from "../components/FeaturedProduct";
import Footer from "../components/Footer";
import HeaderSlider from "../components/HeaderSlider";
import HomeProducts from "../components/HomeProducts";
import Navbar from "../components/Navbar";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
