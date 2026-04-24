import { Truck, Lock, RotateCcw, Headphones } from 'lucide-react';
import { features } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Lock,
  RotateCcw,
  Headphones,
};

export default function FeaturesBar() {
  const { language } = useLanguage();

  return (
    <section className="bg-[#e8f5e9] py-8 border-b border-gray-200">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            const title = language === 'ar' ? feature.title : feature.titleEn;
            const description = language === 'ar' ? feature.description : feature.descriptionEn;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 group animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#2d5d2a] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
