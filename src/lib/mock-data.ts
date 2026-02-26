
export interface Article {
  slug: string;
  title: string;
  category: 'State' | 'District' | 'Place';
  parent?: string;
  content: string;
  image: string;
  tags: string[];
}

export const STATES = [
  { name: 'Andhra Pradesh', code: 'AP' },
  { name: 'Arunachal Pradesh', code: 'AR' },
  { name: 'Assam', code: 'AS' },
  { name: 'Bihar', code: 'BR' },
  { name: 'Chhattisgarh', code: 'CG' },
  { name: 'Goa', code: 'GA' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Haryana', code: 'HR' },
  { name: 'Himachal Pradesh', code: 'HP' },
  { name: 'Jharkhand', code: 'JH' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Kerala', code: 'KL' },
  { name: 'Madhya Pradesh', code: 'MP' },
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Manipur', code: 'MN' },
  { name: 'Meghalaya', code: 'ML' },
  { name: 'Mizoram', code: 'MZ' },
  { name: 'Nagaland', code: 'NL' },
  { name: 'Odisha', code: 'OD' },
  { name: 'Punjab', code: 'PB' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Sikkim', code: 'SK' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Telangana', code: 'TG' },
  { name: 'Tripura', code: 'TR' },
  { name: 'Uttar Pradesh', code: 'UP' },
  { name: 'Uttarakhand', code: 'UK' },
  { name: 'West Bengal', code: 'WB' }
].sort((a, b) => a.name.localeCompare(b.name));

export const ARTICLES: Article[] = [
  {
    slug: 'uttar-pradesh',
    title: 'Uttar Pradesh',
    category: 'State',
    content: 'Uttar Pradesh is a state in northern India. With over 241 million inhabitants, it is the most populated state in India as well as the most populous country subdivision in the world. It was established in 1950 after India had become a republic.',
    image: 'https://picsum.photos/seed/up1/800/600',
    tags: ['North India', 'Hindi Heartland', 'Ganges']
  },
  {
    slug: 'maharashtra',
    title: 'Maharashtra',
    category: 'State',
    content: 'Maharashtra is a state in the western peninsular region of India occupying a substantial portion of the Deccan Plateau. Maharashtra is the second-most populous state in India as well as the third-most populous country subdivision in the world.',
    image: 'https://picsum.photos/seed/mh1/800/600',
    tags: ['West India', 'Economic Hub', 'Marathi']
  },
  {
    slug: 'taj-mahal',
    title: 'Taj Mahal',
    category: 'Place',
    parent: 'agra',
    content: 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.',
    image: 'https://picsum.photos/seed/taj1/800/600',
    tags: ['UNESCO World Heritage', 'Mughal Architecture', 'Wonders of the World']
  },
  {
    slug: 'agra',
    title: 'Agra',
    category: 'District',
    parent: 'uttar-pradesh',
    content: 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh, about 230 kilometres south-east of the national capital Delhi and 330 km west of the state capital Lucknow.',
    image: 'https://picsum.photos/seed/agra1/800/600',
    tags: ['Tourism', 'History', 'Mughal City']
  }
];
