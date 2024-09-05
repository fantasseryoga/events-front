import { CategoryInterface } from "../category/category.interface";
import { CityInterface } from "../city/city.interface";

export interface EventCreationalInerface {
  title: string,
  address: string,
  description?: string,
  eventDate: Date | null,
  selectedCity: CityInterface | null,
  selectedCategories: CategoryInterface[] 
}
