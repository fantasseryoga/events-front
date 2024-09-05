import { CategoryInterface } from "../category/category.interface";
import { CityInterface } from "../city/city.interface";

export interface EventInerface {
  id: string,
  title: string,
  address: string;
  description: string,
  eventDate: string,
  city: CityInterface,
  categories: CategoryInterface[] 
}
