import headwear1 from "@/assets/images/cat-headwear_1.jpg";
import headwear2 from "@/assets/images/cat-headwear_2.jpg";
import headwear3 from "@/assets/images/cat-headwear_3.jpg";
import headwear4 from "@/assets/images/cat-headwear_4.jpg";
import jewelry1 from "@/assets/images/cat-jewelry_1.jpg";
import jewelry2 from "@/assets/images/cat-jewelry_2.jpg";
import jewelry3 from "@/assets/images/cat-jewelry_3.jpg";
import jewelry4 from "@/assets/images/cat-jewelry_4.jpg";
import dressing1 from "@/assets/images/cat-dressing_1.jpg";
import dressing2 from "@/assets/images/cat-dressing_2.jpg";
import dressing3 from "@/assets/images/cat-dressing_3.jpg";
import dressing4 from "@/assets/images/cat-dressing_4.jpg";

const CATEGORY_IMAGES: Record<string, string[]> = {
  "01.Headwear": [headwear1, headwear2, headwear3, headwear4],
  "02.Jewelry": [jewelry1, jewelry2, jewelry3, jewelry4],
  "03.Dressing": [dressing1, dressing2, dressing3, dressing4],
};

export function getProductImage(productId: number, categoryName: string): string | null {
  const images = CATEGORY_IMAGES[categoryName];
  if (!images || images.length === 0) return null;
  return images[productId % images.length];
}
