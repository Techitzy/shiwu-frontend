import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

// Dummy data for events
const eventsData = [
  {
    id: '1',
    name: 'House Party',
    category: 'House Party',
    date: '15 Dec',
    time: '8:00 PM',
    city: 'New York',
    bannerImage:
      'https://www.eventbrite.com/blog/wp-content/uploads/2023/02/aditya-chinchure-ZhQCZjr9fHo-unsplash-768x576.jpg',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '2',
    name: 'Christmas Party',
    category: 'Festive Activities',
    date: '20 Dec',
    time: '7:00 PM',
    city: 'Los Angeles',
    bannerImage:
      'https://thumbs.dreamstime.com/b/merry-christmas-happy-new-year-greeting-banner-template-penguin-design-232657123.jpg',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '3',
    name: 'Office Annual Meetup',
    category: 'Corporate Events',
    date: '1 Jan',
    time: '9:00 AM',
    city: 'San Francisco',
    bannerImage:
      'https://www.shutterstock.com/image-vector/dark-blue-purple-pink-golden-600nw-2227855465.jpg',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '4',
    name: 'Birthday Bash',
    category: 'Birthday Parties',
    date: '25 Nov',
    time: '5:00 PM',
    city: 'Miami',
    bannerImage:
      'https://via.placeholder.com/150/FFC107/FFFFFF?text=Birthday+Bash',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '5',
    name: 'Music Concert',
    category: 'Concerts',
    date: '2 Feb',
    time: '6:00 PM',
    city: 'Chicago',
    bannerImage:
      'https://img.freepik.com/free-psd/music-banner-design-template_23-2149081198.jpg',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '6',
    name: 'Summer BBQ',
    category: 'Outdoor Adventures',
    date: '6 Jun',
    time: '12:00 PM',
    city: 'Austin',
    bannerImage:
      'https://img.freepik.com/free-vector/hand-drawn-bbq-party-horizontal-banner_23-2150875736.jpg',
    images: [
      'https://imgs.search.brave.com/Edz5WUEoXIETvs6RBosR5CaV54ro_F3WUibv9-gIRH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAy/OTEwMjQwL3Bob3Rv/L3BhcnR5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13cFd5/YzdmbmxsRGh2MjFo/R2xzUUhZS0p4aHAt/c0p2X1FUYXFJWld0/UTVzPQ',
      'https://imgs.search.brave.com/qdmduDef2-LV99rTzPT96aWYp-skKIRj9-sMFiuEhuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI4NDgw/ODQuanBn',
      'https://imgs.search.brave.com/yadCS_5ev-FGwhvAHBMbCdOtWoYPtok9Ij3fUvCUtIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzI2LzM5LzA5/LzM2MF9GXzUyNjM5/MDk4N19uV0g4WkJL/RmpDa21wTFdoQTNn/bjlqcXdhcGtRQTht/Mi5qcGc',
    ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

// Create Context
const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [userPostedEvents, setUserPostedEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPostedEvents = async () => {
    try {
      setIsLoading(true);
      console.log('[BusinessContext] fetchUserPostedEvents — AsyncStorage.getItem("accessToken") ...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('[BusinessContext] fetchUserPostedEvents — accessToken:', accessToken ? '✓ found' : '✗ null');
      if (!accessToken) throw new Error('Access token not found.');

      const response = await axios.get(
        `https://shivoo-backend.onrender.com/events/user_events?access_token=${encodeURIComponent(
          accessToken.trim(),
        )}`,
      );

      const events = response.data;
      const currentDate = new Date();

      console.log('EVENTS', events);

      // Categorize events by adjusting date parsing
      const recent = events.filter(
        event => new Date(event.datetime.replace('T', ' ')) >= currentDate,
      );
      console.log('RECENT', recent);
      const past = events.filter(
        event => new Date(event.datetime.replace('T', ' ')) < currentDate,
      );
      console.log('PAST', past);

      setUserPostedEvents(events);
      setRecentEvents(recent);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching user-posted events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEvents = () => {
    // Simulating a fetch request
    setEvents(eventsData);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        events,
        getEvents,
        userPostedEvents,
        recentEvents,
        pastEvents,
        isLoading,
        fetchUserPostedEvents,
      }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => useContext(BusinessContext);
