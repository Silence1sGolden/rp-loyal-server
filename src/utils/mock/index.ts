import { Character, ShortCharacter } from '@/models/characters.js';
import { Author, Story, StoryRequestForm } from '@/models/stories.js';

export const AUTHORS: Author[] = [
  {
    id: '1',
    nickname: 'Slience',
    avatar:
      'https://i.pinimg.com/736x/db/87/c9/db87c9ab8c3a496cb387967f32cc6c1e.jpg',
    active_story: 0,
  },
  {
    id: '2',
    nickname: 'Keke-901',
    avatar:
      'https://i.pinimg.com/736x/ea/c3/f4/eac3f4bcb400cb4b4f865769f8e3fb2a.jpg',
    active_story: 0,
  },
  {
    id: '3',
    nickname: 'MISS MOKI',
    avatar:
      'https://i.pinimg.com/1200x/d7/6b/c7/d76bc7d512113ce74445e0c4ae4147ec.jpg',
    active_story: 0,
  },
];

export const STORIES: Story[] = [
  {
    id: 'Dfasf6asf7a6s8d7as678d6a7f6a',
    title: 'Dreams Factory',
    description:
      'Anim exercitation reprehenderit esse labore Lorem mollit voluptate veniam. Amet amet labore do veniam do non Lorem do magna Lorem culpa. Deserunt cupidatat Lorem occaecat occaecat magna ex sit aliqua non ad eiusmod et excepteur. Occaecat ut esse culpa occaecat Lorem enim aliqua eu eu in. Elit pariatur Lorem ex non incididunt tempor aute nulla elit culpa. Aute adipisicing fugiat labore laborum aliquip pariatur anim dolore laborum excepteur.',
    preview:
      'https://i.pinimg.com/1200x/de/ae/c6/deaec65afab95c315328e682c6911c26.jpg',
    tags: [
      { id: '1', name: 'SFW' },
      { id: '2', name: 'Steam-Punk' },
    ],
    play_type: '1v1',
    play_style: ['one-line'],
    author: AUTHORS[0],
  },
  {
    id: 'g78a078as07dfas89f7as89f7a8',
    title: 'Hope and Red',
    description:
      'Ea proident ullamco excepteur adipisicing esse deserunt qui. Occaecat esse sunt incididunt et quis nisi Lorem amet consectetur cupidatat et. Culpa magna non labore ullamco culpa minim culpa cillum ad in id. Mollit ea pariatur sunt adipisicing fugiat officia cillum qui ipsum amet.',
    preview:
      'https://i.pinimg.com/1200x/7e/cd/70/7ecd70c42deb9d472ee39a3bcf62301e.jpg',
    tags: [
      { id: '3', name: 'NSFW' },
      { id: '4', name: 'Slow-Burn' },
      { id: '5', name: 'Fantasy' },
    ],
    play_type: '1v1',
    play_style: ['para+'],
    author: AUTHORS[1],
  },
  {
    id: 'a8sd7f6as8d7f6as8d7f6a8sd7f',
    title: 'Echoes of Tomorrow',
    description:
      'Cillum sunt irure nulla ut minim non quis duis deserunt do. Id est eu anim in esse nostrud excepteur non pariatur. Adipisicing do et laboris elit in ut aute excepteur eu. Non labore eu nostrud aliqua nostrud cupidatat cupidatat ipsum non commodo.',
    preview:
      'https://i.pinimg.com/736x/b4/14/51/b4145127f6bd9bdeff0889f75fd75890.jpg',
    tags: [
      { id: '6', name: 'Sci-Fi' },
      { id: '7', name: 'Mystery' },
      { id: '8', name: 'Cyberpunk' },
    ],
    play_type: '1v1',
    play_style: ['novella'],
    author: AUTHORS[2],
  },
  {
    id: '9f7as89f7as89d7f6asd8f7a6s',
    title: 'The Last Ember',
    description:
      'Incididunt exercitation consectetur anim excepteur commodo ullamco ullamco labore. Eiusmod adipisicing voluptate officia fugiat ipsum esse laborum. Sint qui sit do velit culpa et reprehenderit eu Lorem.',
    preview:
      'https://i.pinimg.com/236x/42/e6/63/42e66319daef405e7ad453826c37f1e7.jpg',
    tags: [
      { id: '5', name: 'Fantasy' },
      { id: '9', name: 'Adventure' },
      { id: '4', name: 'Slow-Burn' },
    ],
    play_type: '1v1',
    play_style: ['para+', 'semi-para'],
    author: AUTHORS[2],
  },
  {
    id: 'd6as7d68as7d6as8d7f6as8df7',
    title: 'Veil of Shadows',
    description:
      'Dolore amet qui do commodo laboris nisi irure. Ex enim do pariatur laboris occaecat et anim. Dolor eiusmod nulla sint excepteur id culpa nostrud ad amet eiusmod ad ea. Non elit nisi excepteur aliqua laborum ipsum.',
    preview:
      'https://i.pinimg.com/736x/49/fe/6b/49fe6b783a2918d0ef5e9fa9ba921eb7.jpg',
    tags: [
      { id: '10', name: 'Horror' },
      { id: '7', name: 'Mystery' },
      { id: '3', name: 'NSFW' },
    ],
    play_type: 'Group',
    play_style: ['one-line', 'semi-para'],
    author: AUTHORS[2],
  },
  {
    id: 'as0d87f6as8d7f6as8d7f6as8df',
    title: 'Chronicles of the Void',
    description:
      'Veniam laborum nulla officia cillum id amet pariatur consectetur. Ea Lorem culpa eu cillum veniam sint aute occaecat velit. Proident fugiat occaecat ut et eu cupidatat. Exercitation laboris sint enim laboris.',
    preview:
      'https://i.pinimg.com/1200x/b2/e8/57/b2e85726944b5c4ff97882064775bebf.jpg',
    tags: [
      { id: '11', name: 'Space' },
      { id: '9', name: 'Adventure' },
      { id: '1', name: 'SFW' },
    ],
    play_type: '1v1',
    play_style: ['novella'],
    author: AUTHORS[2],
  },
  {
    id: 'f87as6d8f7as6d8f7a6s8d7f6a',
    title: 'Whispers in the Dark',
    description:
      'Culpa labore non duis amet et culpa et. Officia voluptate tempor labore ad elit ullamco et in voluptate nisi. Ex magna ullamco veniam laborum occaecat sunt Lorem.',
    preview:
      'https://i.pinimg.com/1200x/3f/b9/82/3fb982f3241f53edfc0126efab57956a.jpg',
    tags: [
      { id: '12', name: 'Thriller' },
      { id: '13', name: 'Psychological' },
      { id: '3', name: 'NSFW' },
    ],
    play_type: '1v1',
    play_style: ['para+'],
    author: AUTHORS[2],
  },
  {
    id: '6as8d7f6as8d7f6as8d7f6as8d7',
    title: 'Forgotten Kingdom',
    description:
      'Do nisi cillum ullamco ex sit nisi Lorem et dolor laboris. Officia culpa cupidatat ea nisi quis. Veniam consectetur cupidatat in elit exercitation amet sunt do non. Incididunt ut occaecat est minim.',
    preview:
      'https://i.pinimg.com/1200x/9b/6c/21/9b6c2101b3350b2780c677e4305eac9b.jpg',
    tags: [
      { id: '14', name: 'Medieval' },
      { id: '5', name: 'Fantasy' },
      { id: '15', name: 'Drama' },
    ],
    play_type: 'Group',
    play_style: ['semi-para', 'novella'],
    author: AUTHORS[2],
  },
  {
    id: '7d6as8d7f6as8d7f6as8d7f6a8',
    title: 'Neon Dreams',
    description:
      'Tempor amet consectetur minim anim nisi commodo cillum labore. Ex anim excepteur sint ex laboris elit laborum dolore. Ea nulla eiusmod culpa eiusmod velit nulla. Sunt esse velit do minim qui.',
    preview:
      'https://i.pinimg.com/1200x/d9/8f/b1/d98fb1ddba1b8487ba1b43d8832e91a7.jpg',
    tags: [
      { id: '8', name: 'Cyberpunk' },
      { id: '16', name: 'Romance' },
      { id: '17', name: 'Slice of Life' },
    ],
    play_type: '1v1',
    play_style: ['one-line', 'para+'],
    author: AUTHORS[2],
  },
  {
    id: '8asd7f6as8d7f6as8d7f6as8d7',
    title: 'Starlight Crusade',
    description:
      'Mollit eu excepteur sunt occaecat dolore est do elit excepteur laboris. Adipisicing in sit ad labore ut sint voluptate nulla. Consequat do cillum sit enim in elit amet laboris tempor.',
    preview:
      'https://i.pinimg.com/1200x/5e/fa/4b/5efa4b32bfead92bf39b0a4c2e6c74c8.jpg',
    tags: [
      { id: '6', name: 'Sci-Fi' },
      { id: '18', name: 'Action' },
      { id: '9', name: 'Adventure' },
    ],
    play_type: 'Group',
    play_style: ['novella'],
    author: AUTHORS[2],
  },
  {
    id: '9f7as8d7f6as8d7f6as8d7f6as8',
    title: 'Ironbound',
    description:
      'Quis excepteur duis excepteur eiusmod ipsum pariatur nostrud commodo. Enim elit cupidatat ut commodo amet. Reprehenderit laboris elit quis velit id consequat eiusmod veniam est.',
    preview:
      'https://i.pinimg.com/736x/c1/1e/4c/c11e4c550c06bfe42f199df35dbe0984.jpg',
    tags: [
      { id: '2', name: 'Steam-Punk' },
      { id: '18', name: 'Action' },
      { id: '1', name: 'SFW' },
    ],
    play_type: '1v1',
    play_style: ['semi-para'],
    author: AUTHORS[2],
  },
  {
    id: '0as8d7f6as8d7f6as8d7f6as8d7',
    title: 'Shattered Crown',
    description:
      'Aliquip sint minim enim laboris mollit aliqua ea. Lorem nisi excepteur quis pariatur aliquip veniam eu amet. Dolor quis ea enim ad cillum et excepteur aute.',
    preview:
      'https://i.pinimg.com/1200x/f7/cc/62/f7cc6284c3208df868eba54a789bad95.jpg',
    tags: [
      { id: '5', name: 'Fantasy' },
      { id: '19', name: 'Political' },
      { id: '4', name: 'Slow-Burn' },
    ],
    play_type: '1v1',
    play_style: ['para+', 'novella'],
    author: AUTHORS[2],
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

export const CHARACTERS: Character[] = [
  {
    id: 'af78asf7a8f7as8',
    first_name: 'John',
    second_name: 'Snow',
    avatar:
      'https://i.pinimg.com/736x/b2/25/cd/b225cd2524dd2ef4c013c42c0f3e9307.jpg',
    age: 43,
    gender: 'Male',
    history:
      'Consequat laboris minim exercitation aute adipisicing. Sit amet eu anim dolor mollit commodo esse eu irure nulla laboris laboris exercitation ullamco. Elit mollit mollit ut exercitation consequat. Dolor elit ea ullamco enim voluptate cillum et deserunt. Nostrud amet proident aliqua tempor pariatur culpa enim exercitation. Officia quis amet elit exercitation cillum aliqua irure laboris labore occaecat reprehenderit fugiat cupidatat. Enim consectetur elit dolore nostrud laboris ad.',
    appearance:
      'Mollit anim consequat nostrud cupidatat adipisicing cupidatat adipisicing sint et dolor adipisicing. Labore incididunt non ad eu cillum ex culpa non fugiat. Sunt dolore labore duis mollit nostrud minim ad eiusmod consectetur. Excepteur nostrud minim sit nulla laboris duis magna eu reprehenderit proident exercitation est ex. Excepteur id laboris deserunt ut veniam sint culpa laboris et qui quis velit voluptate laboris. Tempor consequat nulla consequat ea esse consequat non et dolor anim. Consectetur duis tempor consectetur occaecat laboris commodo consequat commodo anim mollit et consequat et eiusmod.',
    author: AUTHORS[1],
  },
  {
    id: '9fas7f7a87fasfs',
    first_name: 'Dave',
    second_name: 'Anderson',
    avatar:
      'https://i.pinimg.com/736x/4f/cc/80/4fcc80cd282ff8783b8372eda69f1260.jpg',
    age: 19,
    gender: 'Male',
    history:
      'Dolore exercitation fugiat aliquip ullamco do et veniam sint veniam. Ullamco culpa esse sint aute Lorem dolor in velit. Fugiat sit proident nulla incididunt sint ad culpa ut ullamco duis proident nulla irure anim.',
    appearance:
      'Elit elit enim sunt sint. Amet voluptate veniam adipisicing dolor ipsum culpa consectetur. Magna proident dolore commodo nostrud pariatur dolore ullamco quis id.',
    author: AUTHORS[1],
  },
  {
    id: 'a7sg89as7g89as7g8',
    first_name: 'Sofy',
    second_name: 'Berserk',
    avatar:
      'https://i.pinimg.com/736x/d0/ab/69/d0ab6929996edcd19f84bd018f0ca238.jpg',
    age: 27,
    gender: 'Female',
    history:
      'Aute excepteur amet nostrud irure anim qui nostrud magna eiusmod dolor est. Aliqua cillum id reprehenderit excepteur pariatur pariatur fugiat eu aliquip consequat cupidatat ut commodo dolor. Dolore exercitation pariatur pariatur mollit. Non Lorem velit laboris velit amet consequat esse id ex tempor. Culpa do dolor laborum est in laborum esse enim cillum ipsum nisi enim.',
    appearance:
      'Nulla laboris ullamco Lorem aute cupidatat in non. Est duis pariatur ea fugiat eu labore. Est adipisicing ad adipisicing excepteur ad dolore. Quis proident sunt occaecat incididunt fugiat adipisicing. Proident laborum velit reprehenderit ad ullamco do esse ipsum aliqua adipisicing ut labore fugiat.',
    author: AUTHORS[1],
  },
  {
    id: '7a9gh87aasdfasd79f87',
    first_name: 'Kirity',
    second_name: 'Alembandey',
    avatar:
      'https://i.pinimg.com/736x/41/64/31/4164313648e333c6164a54cf9c07f91b.jpg',
    age: 666,
    gender: 'Male',
    history:
      'Tempor consectetur magna officia duis eu minim. Ut laborum laborum et commodo occaecat aliquip. Officia magna officia nulla nulla amet. Officia incididunt voluptate officia nostrud enim velit culpa do non nulla. Sunt cillum velit in mollit fugiat ipsum eu pariatur excepteur incididunt sit elit nisi elit. Consequat nisi occaecat commodo consequat enim pariatur id aliqua adipisicing do ut elit sit anim. Nisi sint aute quis occaecat eiusmod commodo anim nulla dolor eu occaecat.',
    appearance:
      'Labore in est voluptate aliqua eu in laboris. Nulla elit sint qui duis. Nisi do dolore aute ea dolor culpa. Id nostrud eiusmod aute cillum aliqua mollit ex eiusmod. Enim qui sit sint mollit incididunt minim incididunt occaecat veniam. Pariatur in magna irure laborum sint. Deserunt magna ullamco qui do.',
    author: AUTHORS[1],
  },
];

export const REQUESTS: StoryRequestForm[] = [
  {
    id: 'f7a89f7as89f7a89f',
    author: AUTHORS[1],
    character: CHARACTERS[2],
  },
  {
    id: '7as89gh7as89fg7sd9',
    author: AUTHORS[2],
    character: CHARACTERS[3],
  },
];
