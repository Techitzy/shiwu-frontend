import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import { confirmBooking } from '../services/PaymentService';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [fetchRequired, setFetchRequired] = useState(false);
  const [events, setEvents] = useState([]);
  const [host, setHost] = useState([]);

  const fetchCategories = async () => {
    try {
      console.log('[EventContext] fetchCategories — AsyncStorage.getItem("accessToken") ...');
      const accessTokenDetails = await AsyncStorage.getItem('accessToken');
      console.log('[EventContext] fetchCategories — accessToken:', accessTokenDetails ? '✓ found' : '✗ null');

      if (!accessTokenDetails) {
        throw new Error('Access token not found.');
      }

      const response = await axios.get(
        `https://shivoo-backend.onrender.com/event_options/categories?access_token=${encodeURIComponent(
          accessTokenDetails.trim(),
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.map(category => ({
        id: category.id,
        label: category.name,
        selected: false,
      }));
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      throw error;
    }
  };

  const fetchAmenities = async () => {
    try {
      console.log('[EventContext] fetchAmenities — AsyncStorage.getItem("accessToken") ...');
      const accessTokenDetails = await AsyncStorage.getItem('accessToken');
      console.log('[EventContext] fetchAmenities — accessToken:', accessTokenDetails ? '✓ found' : '✗ null');

      if (!accessTokenDetails) {
        throw new Error('Access token not found.');
      }

      const response = await axios.get(
        `https://shivoo-backend.onrender.com/event_options/amenities?access_token=${encodeURIComponent(
          accessTokenDetails.trim(),
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.map(category => ({
        id: category.id,
        label: category.name,
        selected: false,
      }));
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (fetchRequired) {
      const loadData = async () => {
        try {
          setLoading(true);
          const [categoriesData, amenitiesData] = await Promise.all([
            fetchCategories(),
            fetchAmenities()
          ]);
          setCategories(categoriesData);
          setAmenities(amenitiesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [fetchRequired]);

  const uploadImage = async (folder, image) => {
    const { fileName, uri } = image;
    const uniqueFileName = `${uuid.v4()}_${fileName}`;
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: uniqueFileName,
      type: image.type,
    });

    try {
      const response = await axios.post(
        `https://shivoo-file-server.onrender.com/assets/${folder}/upload/${uniqueFileName}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      return {
        id: uniqueFileName,
        url: response.data.file_url,
        fileName: uniqueFileName,
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const addEvent = async eventDetails => {
    try {
      console.log('[EventContext] addEvent — AsyncStorage.getItem("accessToken") ...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('[EventContext] addEvent — accessToken:', accessToken ? '✓ found' : '✗ null');
      if (!accessToken) throw new Error('Access token not found.');

      const response = await axios.post(
        `https://shivoo-backend.onrender.com/events/add?access_token=${encodeURIComponent(
          accessToken.trim(),
        )}`,
        eventDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const deleteEvent = async eventId => {
    try {
      console.log('[EventContext] deleteEvent — AsyncStorage.getItem("accessToken") ...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('[EventContext] deleteEvent — accessToken:', accessToken ? '✓ found' : '✗ null');
      if (!accessToken) throw new Error('Access token not found.');

      const response = await axios.delete(
        `https://shivoo-backend.onrender.com/events/event/${eventId}?access_token=${encodeURIComponent(
          accessToken.trim(),
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const updateEvent = async eventDetails => {
    try {
      console.log('[EventContext] updateEvent — AsyncStorage.getItem("accessToken") ...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('[EventContext] updateEvent — accessToken:', accessToken ? '✓ found' : '✗ null');
      if (!accessToken) throw new Error('Access token not found.');

      const response = await axios.patch(
        `https://shivoo-backend.onrender.com/events/event/${eventDetails.id
        }?access_token=${encodeURIComponent(accessToken.trim())}`,
        eventDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const isNewImage = image => {
    return image.hasOwnProperty('type');
  };

  const separateImages = images => {
    const newImages = [];
    const existingImages = [];

    images.forEach(image => {
      if (isNewImage(image)) {
        newImages.push(image);
      } else {
        existingImages.push(image);
      }
    });

    return { newImages, existingImages };
  };

  const editEventWithImages = async (eventDetails, images) => {
    const { newImages, existingImages } = separateImages(images);

    try {
      const folder = 'event_files';
      const uploadedImages = [];

      // Upload new images sequentially
      for (let index = 0; index < newImages.length; index++) {
        const image = newImages[index];
        const uploaded = await uploadImage(folder, image);
        uploaded.sequence = existingImages.length + index + 1; // Set sequence correctly
        uploadedImages.push(uploaded);
      }

      // Combine existing and newly uploaded images
      const combinedImages = [...existingImages, ...uploadedImages];

      // Prepare the event payload
      const eventPayload = {
        ...eventDetails,
        banner_img: combinedImages[0]?.url,
        meta: {
          ...eventDetails.meta,
          images: combinedImages.map(({ url, fileName, sequence }) => ({
            url,
            fileName,
            sequence,
          })),
        },
      };

      // Update the event
      const eventResponse = await updateEvent(eventPayload);

      return eventResponse;
    } catch (error) {
      console.error('Error updating event with images:', error);
      throw error;
    }
  };

  const createEventWithImages = async (eventDetails, images) => {
    try {
      const folder = 'event_files';

      // Step 1: Upload images in parallel
      const uploadedImages = [];

      // Step 1: Upload images sequentially
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        const uploaded = await uploadImage(folder, image);
        uploadedImages.push({
          ...uploaded,
          sequence: index + 1,
        });
      }

      // Step 2: Prepare the event payload
      const eventPayload = {
        ...eventDetails,
        banner_img: uploadedImages[0]?.url,
        meta: {
          ...eventDetails.meta,
          images: uploadedImages.map(({ url, fileName, sequence }) => ({
            url,
            fileName,
            sequence,
          })),
        },
      };

      // Step 3: Create the event
      const eventResponse = await addEvent(eventPayload);

      return eventResponse;
    } catch (error) {
      console.error('Error creating event with images:', error);
      throw error;
    }
  };

  const fetchAllEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await axios.get(
        `https://shivoo-backend.onrender.com/events/all_events`,
      );
      setEvents(response.data);
      setEventsLoading(false);
      return response.data;
    } catch (error) {
      setEventsLoading(false);
      console.error('Error in fetchAllEvents:', error);
      throw error;
    }
  };

  const fetchHostData = async userId => {
    try {
      setLoading(true);
      const idSource = 'user_id';
      const url = `https://shivoo-backend.onrender.com/user_auth/user?_id=${userId}&id_src=${idSource}`;

      const response = await axios.get(url);

      setHost(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching host data:', error);
      throw error;
    }
  };

  /**
   * Confirm an event booking after a successful Razorpay payment.
   * @param {string} eventId
   * @param {{ razorpay_payment_id, razorpay_order_id, razorpay_signature }} paymentData
   * @param {number} ticketCount
   */
  const bookEvent = async (eventId, paymentData, ticketCount) => {
    return confirmBooking({
      eventId,
      ticketCount,
      ...paymentData,
    });
  };

  return (
    <EventContext.Provider
      value={{
        categories,
        setCategories,
        amenities,
        setAmenities,
        loading,
        eventsLoading,
        setEventsLoading,
        setFetchRequired,
        editEventWithImages,
        createEventWithImages,
        events,
        setEvents,
        fetchAllEvents,
        deleteEvent,
        bookEvent,
        host,
        setHost,
        fetchHostData,
        fetchCategories,
      }}>
      {children}
    </EventContext.Provider>
  );
};
