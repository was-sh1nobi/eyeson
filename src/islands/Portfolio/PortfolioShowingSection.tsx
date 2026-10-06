import { useState, useEffect } from "react";
import { MediaGrid } from "../Shared/PostComp.tsx";
import { httpService } from "@/utils/httpService.ts";

const CATEGORIES = ["All", "Brand Trailer", "Explainer Videos", "Motion Graphics", "Ad Creatives", "Social Content", "Graphic Design"];

export const PortfolioShowingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const payload: any = {};
        if (selectedCategory !== "All") {
          payload.category = selectedCategory;
        }
        
        const res: any = await httpService.post(`/portfolio/list?page=${page}&limit=${limit}`, payload);
        
        const mappedItems = res.videos.map((v: any) => ({
           id: v.id,
           src: v.cover ? (v.cover.startsWith('http') ? v.cover : `${import.meta.env.PUBLIC_API_URL}${v.cover}`) : '/video-pieces/person.webp',
           videoUrl: v.video ? (v.video.startsWith('http') ? v.video : `${import.meta.env.PUBLIC_API_URL}${v.video}`) : '',
           previewUrl: v.preview ? (v.preview.startsWith('http') ? v.preview : `${import.meta.env.PUBLIC_API_URL}${v.preview}`) : undefined,
           playable: !!v.video,
           category: v.category,
           title: v.category
        }));
        
        setItems(mappedItems);
        setTotalPages(res.meta.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch portfolios", err);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, [selectedCategory, page]);

  return (
    <section
      className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center animate-fade-in"
      className="mt-20 flex w-full flex-col items-center justify-center px-4 sm:mt-24 sm:px-6"
    >
      <div className="w-full max-w-5xl text-center">
        <h4 className="text-xs font-thin tracking-[0.2em] sm:text-sm">OUR WORK</h4>
        <h2 className="bg-linear-to-r from-[#46B6A0] to-[#2EBACA] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
          Featured Projects & Creative Work
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm font-light leading-7 sm:text-base">
          Explore a collection of videos, animations, ad creatives, and visual content created for
          startups, SaaS companies, and modern brands.
          From brand trailers and product explainers to motion graphics, social content, and
          performance-driven ad creatives, every project is crafted to communicate clearly, capture
          attention, and leave a lasting impression.
        </p>
      </div>

      <div className="w-full">
        <MediaGrid
          mediaType="Video"
          pageSize={limit}
          items={items}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={loading}
        />
      </div>
    </section>
  );
};
