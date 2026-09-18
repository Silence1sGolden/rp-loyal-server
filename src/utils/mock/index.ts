import {
  CharactersSchema,
  ShortCharacter,
} from '@/models/schemas/characters.js';
import {
  Author,
  StoriesApplicationsSchema,
  StoriesSchema,
} from '@/models/schemas/stories.js';

export const AUTHORS: Author[] = [
  {
    id: 1,
    nickname: 'Slience',
    avatar:
      'https://i.pinimg.com/736x/db/87/c9/db87c9ab8c3a496cb387967f32cc6c1e.jpg',
  },
  {
    id: 2,
    nickname: 'Keke-901',
    avatar:
      'https://i.pinimg.com/736x/ea/c3/f4/eac3f4bcb400cb4b4f865769f8e3fb2a.jpg',
  },
  {
    id: 3,
    nickname: 'MISS MOKI',
    avatar:
      'https://i.pinimg.com/1200x/d7/6b/c7/d76bc7d512113ce74445e0c4ae4147ec.jpg',
  },
];

export const STORIES: StoriesSchema[] = [
  {
    id: 1,
    title: 'Dreams Factory',
    description:
      'Anim exercitation reprehenderit esse labore Lorem mollit voluptate veniam. Amet amet labore do veniam do non Lorem do magna Lorem culpa. Deserunt cupidatat Lorem occaecat occaecat magna ex sit aliqua non ad eiusmod et excepteur. Occaecat ut esse culpa occaecat Lorem enim aliqua eu eu in. Elit pariatur Lorem ex non incididunt tempor aute nulla elit culpa. Aute adipisicing fugiat labore laborum aliquip pariatur anim dolore laborum excepteur.',
    preview_id: null,
    play_type: '1v1',
    author_id: 1,
    updated_at: '',
    created_at: '',
  },
  {
    id: 2,
    title: 'Hope and Red',
    description:
      'Ea proident ullamco excepteur adipisicing esse deserunt qui. Occaecat esse sunt incididunt et quis nisi Lorem amet consectetur cupidatat et. Culpa magna non labore ullamco culpa minim culpa cillum ad in id. Mollit ea pariatur sunt adipisicing fugiat officia cillum qui ipsum amet.',
    preview_id: null,
    play_type: '1v1',
    author_id: 2,
    updated_at: '',
    created_at: '',
  },
  {
    id: 3,
    title: 'Echoes of Tomorrow',
    description:
      'Cillum sunt irure nulla ut minim non quis duis deserunt do. Id est eu anim in esse nostrud excepteur non pariatur. Adipisicing do et laboris elit in ut aute excepteur eu. Non labore eu nostrud aliqua nostrud cupidatat cupidatat ipsum non commodo.',
    preview_id: null,
    play_type: '1v1',
    author_id: 2,
    updated_at: '',
    created_at: '',
  },
];

export const SHORT_CHARACTERS: ShortCharacter[] = [
  {
    id: 'af78asf7a8f7as8',
    first_name: 'John',
    second_name: 'Snow',
    avatar:
      'https://i.pinimg.com/736x/b2/25/cd/b225cd2524dd2ef4c013c42c0f3e9307.jpg',
  },
  {
    id: '9fas7f7a87fasfs',
    first_name: 'Dave',
    second_name: 'Anderson',
    avatar:
      'https://i.pinimg.com/736x/4f/cc/80/4fcc80cd282ff8783b8372eda69f1260.jpg',
  },
];

export const CHARACTERS: CharactersSchema[] = [
  {
    id: 1,
    first_name: 'John',
    second_name: 'Snow',
    avatar_id: null,
    age: 43,
    gender: 'Male',
    history:
      'Consequat laboris minim exercitation aute adipisicing. Sit amet eu anim dolor mollit commodo esse eu irure nulla laboris laboris exercitation ullamco. Elit mollit mollit ut exercitation consequat. Dolor elit ea ullamco enim voluptate cillum et deserunt. Nostrud amet proident aliqua tempor pariatur culpa enim exercitation. Officia quis amet elit exercitation cillum aliqua irure laboris labore occaecat reprehenderit fugiat cupidatat. Enim consectetur elit dolore nostrud laboris ad.',
    appearance:
      'Mollit anim consequat nostrud cupidatat adipisicing cupidatat adipisicing sint et dolor adipisicing. Labore incididunt non ad eu cillum ex culpa non fugiat. Sunt dolore labore duis mollit nostrud minim ad eiusmod consectetur. Excepteur nostrud minim sit nulla laboris duis magna eu reprehenderit proident exercitation est ex. Excepteur id laboris deserunt ut veniam sint culpa laboris et qui quis velit voluptate laboris. Tempor consequat nulla consequat ea esse consequat non et dolor anim. Consectetur duis tempor consectetur occaecat laboris commodo consequat commodo anim mollit et consequat et eiusmod.',
    author_id: 1,
  },
];

export const REQUESTS: StoriesApplicationsSchema[] = [
  {
    id: 'f7a89f7as89f7a89f',
    story_id: 1,
    author_id: 1,
    character_id: 1,
    covering_letter: null,
    created_at: '',
  },
];
