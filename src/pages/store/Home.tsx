import TopBanner from '@/components/store/TopBanner';
import Header from '@/components/store/Header';
import HeroSlider from '@/components/store/HeroSlider';
import FeaturesBar from '@/components/store/FeaturesBar';
import CategoriesGrid from '@/components/store/CategoriesGrid';
import FeaturedProducts from '@/components/store/FeaturedProducts';
import SpecialOffers from '@/components/store/SpecialOffers';
import BestSellers from '@/components/store/BestSellers';
import Newsletter from '@/components/store/Newsletter';
import Footer from '@/components/store/Footer';

export default function Home() {
  return (
    <>
      <TopBanner />
      <Header />
      <main>
        <HeroSlider />
        <FeaturesBar />
        <CategoriesGrid />
        <FeaturedProducts />
        <SpecialOffers />
        <BestSellers />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
