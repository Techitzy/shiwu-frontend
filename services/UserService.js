// /services/UserService.js

const dummyUserData = [
  {
    userId: 'user123',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    location: 'San Francisco, CA',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    isAdmin: false,
    lastLogin: '2024-11-09T08:30:00Z',
    password: 'password123',
    preferences: {
      theme: 'light',
      language: 'en',
    },
    bio: 'A passionate traveler and tech enthusiast. Loves exploring new cultures and working on innovative projects.',
  },
  {
    userId: 'user456',
    name: 'Rhydim Goel',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    location: 'San Francisco, CA',
    email: 'rhydim@google.com',
    phone: '123-456-7890',
    isAdmin: false,
    lastLogin: '2024-11-09T08:30:00Z',
    password: 'password123',
    preferences: {
      theme: 'light',
      language: 'en',
    },
    bio: 'A software engineer with a love for coding and building applications. Always curious and open to new challenges.',
  },
  {
    userId: 'user789',
    name: 'Rajbir Singh',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    location: 'San Francisco, CA',
    email: 'rajbir@google.com',
    phone: '123-456-7890',
    isAdmin: false,
    lastLogin: '2024-11-09T08:30:00Z',
    password: 'password123',
    preferences: {
      theme: 'light',
      language: 'en',
    },
    bio: 'An avid photographer and nature lover. Enjoys capturing moments of beauty and sharing them with the world.',
  },
];

const UserService = {
  async fetchUserData(email) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = dummyUserData.find(user => user.email === email);
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
};

export default UserService;
