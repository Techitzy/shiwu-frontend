import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import ImageCarousel from '../../components/shared/carousel/ImageCarousel';
import CancellationPolicy from '../../components/shared/event/CancellationPolicy';
import HostDetails from '../../components/shared/event/HostDetails';
import TermsAndConditions from '../../components/shared/event/TermsAndConditions';
import TicketBookingModal from '../../components/shared/event/TicketBookingModal';
import DeleteEventModal from '../../components/shared/modals/DeleteEventModal';
import ProgressModal from '../../components/shared/modals/ProgressModal';
import RazorpayWebModal from '../../components/shared/modals/RazorpayWebModal';
import { EventContext } from '../../context/EventContext';
import { UserContext } from '../../context/UserContext';
import { createOrder } from '../../services/PaymentService';
import { formatDate, formatTime } from '../../services/utils';
import { darkColors, lightColors, primaryColor } from '../../themes/basics';

const RAZORPAY_KEY = 'rzp_test_i4HoYQt0NerAqC';



const EventDetailScreen = () => {
  const { id, event: eventString } = useLocalSearchParams();
  const event = eventString ? JSON.parse(eventString) : null;

  const router = useRouter();
  const colorScheme = useColorScheme();

  const { loading, host, fetchHostData, deleteEvent, bookEvent } = useContext(EventContext);
  const { user } = useContext(UserContext);

  const [showPopup, setShowPopup] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Razorpay payment state
  const [razorpayVisible, setRazorpayVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [pendingTicketCount, setPendingTicketCount] = useState(1);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('Processing...');

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;
  const informationText = '#333';

  useEffect(() => {
    if (event) {
      fetchHostData(event.user_id);
    }
  }, []);

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: textColor }}>Event not found or loading...</Text>
      </View>
    );
  }

  const handleDescriptionToggle = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  // Step 1 — Open ticket selection modal
  const handleBookEvent = () => {
    setModalVisible(true);
  };

  // Step 2 — User confirmed ticket count; create Razorpay order and open WebView checkout
  const handleContinue = async ({ ticketCount, totalAmount }: { ticketCount: number; totalAmount: number }) => {
    setModalVisible(false);
    setPendingTicketCount(ticketCount);
    setPaymentAmount(totalAmount);

    try {
      setProgressMessage('Preparing payment…');
      setShowProgressModal(true);
      const order = await createOrder(totalAmount);
      setRazorpayOrderId(order.order_id ?? null);
      setShowProgressModal(false);
      setTimeout(() => setRazorpayVisible(true), 200);
    } catch (error) {
      setShowProgressModal(false);
      Alert.alert('Error', 'Could not initiate payment. Please try again.');
    }
  };

  // Step 3a — Payment success (called by RazorpayWebModal)
  const handlePaymentSuccess = useCallback(async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string | null;
    razorpay_signature: string | null;
  }) => {
    setRazorpayVisible(false);
    setProgressMessage('Confirming booking…');
    setShowProgressModal(true);

    try {
      await bookEvent(event.id, paymentData, pendingTicketCount);
      setShowProgressModal(false);
      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your ${pendingTicketCount} ticket${pendingTicketCount > 1 ? 's are' : ' is'} booked!\n\nPayment ID: ${paymentData.razorpay_payment_id}`,
        [{ text: 'Done', onPress: () => router.back() }],
      );
    } catch (error) {
      setShowProgressModal(false);
      Alert.alert(
        'Payment Received',
        `Payment ID: ${paymentData.razorpay_payment_id}\n\nBooking sync failed — please contact support.`,
        [{ text: 'OK' }],
      );
    }
  }, [event, pendingTicketCount, bookEvent, router]);

  // Step 3b — User dismissed the checkout WebView
  const handlePaymentDismiss = useCallback(() => {
    setRazorpayVisible(false);
    Alert.alert('Payment Cancelled', 'You closed the payment screen.');
  }, []);

  // Step 3c — Payment failed inside WebView
  const handlePaymentError = useCallback((description: string) => {
    setRazorpayVisible(false);
    Alert.alert('Payment Failed', description || 'Something went wrong. Please try again.');
  }, []);

  const handleDeleteEvent = async () => {
    try {
      setShowPopup(false);
      setProgressMessage('Deleting…');
      setShowProgressModal(true);
      await deleteEvent(event.id);
      setShowProgressModal(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error deleting event:', error);
      setShowProgressModal(false);
    }
  };


  const bookedUsers = [
    { id: 1, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: 2, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: 3, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: 4, image: 'https://example.com/user4.jpg' },
    { id: 5, image: 'https://example.com/user5.jpg' },
  ];

  const openMaps = address => {
    const url = `http://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open this URL: " + url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleShare = async () => {
    try {
      setModalVisible(false);
      await Share.share({
        message: `Check out this event: ${event.title}`,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {event?.title?.toUpperCase()}
          </Text>
        </View>
        <Menu>
          <MenuTrigger>
            <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
          </MenuTrigger>
          <MenuOptions
            style={{
              position: 'absolute',
              color: textColor,
              backgroundColor: informationText,
              borderRadius: 10,
              width: 100,
              top: 30,
              right: 0,
              overflow: 'hidden',
            }}
            optionsContainerStyle={{
              backgroundColor: 'transparent',
            }}>
            <MenuOption onSelect={handleShare}>
              <View style={styles.menuItem}>
                <Ionicons
                  name="share-social"
                  size={20}
                  color={textColor}
                  style={styles.iconStyle}
                />
                <Text style={[styles.textStyle, { color: textColor }]}>
                  Share
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor }]} />
            </MenuOption>
            <MenuOption
              onSelect={() => {
                router.push({
                  pathname: `/event/edit/${event.id}`,
                  params: { id: event.id, event: JSON.stringify(event) },
                });
              }}>
              <View style={styles.menuItem}>
                <Ionicons
                  name="pencil"
                  size={20}
                  color={textColor}
                  style={styles.iconStyle}
                />
                <Text style={[styles.textStyle, { color: textColor }]}>Edit</Text>
              </View>
              <View style={[styles.divider, { backgroundColor }]} />
            </MenuOption>
            <MenuOption onSelect={() => setShowPopup(true)}>
              <View style={styles.menuItem}>
                <Ionicons
                  name="trash"
                  size={20}
                  color={'red'}
                  style={styles.iconStyle}
                />
                <Text style={[styles.textStyle, { color: 'red' }]}>Delete</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <DeleteEventModal
        isVisible={showPopup}
        onCancel={() => setShowPopup(false)}
        onDelete={handleDeleteEvent}
      />

      <ProgressModal isVisible={showProgressModal} message={progressMessage} />

      <ScrollView
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}>
        <View style={[{ backgroundColor }]}>
          {/* Carousel for images */}
          <ImageCarousel event={event} />

          <View style={styles.categoryContainer}>
            {event.categories.map((category, index) => (
              <View
                key={index}
                style={[
                  styles.categoryTag,
                  {
                    backgroundColor: informationText,
                    paddingHorizontal: category.name.length * 1 + 5,
                  }, // Adjust padding dynamically
                ]}>
                <Text style={[styles.categoryText, { color: '#fff' }]}>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.approveRequestsContainer,
              {
                backgroundColor: backgroundColor,
                shadowColor: primaryColor.main,
              },
            ]}>
            <TouchableOpacity
              style={styles.arrowContainer}
              onPress={() =>
                router.push({
                  pathname: `/event/approve-request/${event.id}`,
                  params: { id: event.id },
                })
              }>
              <Text style={[styles.approveRequestsTitle, { color: textColor }]}>
                Approve Requests
              </Text>
              <View style={styles.approvalList}>
                <View style={styles.namesContainer}>
                  <Text style={[styles.approvalName, { color: textColor }]}>
                    Rajbir Singh
                  </Text>
                  {10 > 1 && (
                    <Text style={styles.othersText}> + {10 - 1} others</Text>
                  )}
                </View>

                <Ionicons
                  name={'chevron-forward'}
                  size={24}
                  color={textColor}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Event time and location with icons */}
          <View style={styles.eventDetails}>
            <View style={styles.iconTextContainer}>
              <Ionicons name="calendar-outline" size={20} color={textColor} />
              <Text style={[styles.eventTime, { color: textColor }]}>
                {formatDate(event.datetime)}
              </Text>
            </View>
            <View style={styles.iconTextContainer}>
              <Ionicons name="time-outline" size={20} color={textColor} />
              <Text style={[styles.eventTime, { color: textColor }]}>
                {formatTime(event.datetime)}
              </Text>
            </View>
            <View style={styles.addressTextContainer}>
              <Ionicons name="location-outline" size={20} color={textColor} />
              <Text style={[styles.eventCity, { color: textColor }]}>
                {event.address}
                <TouchableOpacity onPress={() => openMaps(event.address)}>
                  <Feather
                    name="navigation"
                    size={16}
                    color={primaryColor.main}
                  />
                </TouchableOpacity>
              </Text>
            </View>
            <View style={styles.iconTextContainer}>
              <Ionicons name="people-outline" size={20} color={textColor} />
              <Text style={[styles.eventAgeLimit, { color: textColor }]}>
                Age Limit - {event.meta.restrictions.min_age} yrs+
              </Text>
            </View>
          </View>

          <View style={styles.avatarsContainer}>
            {bookedUsers.slice(0, 3).map((user, index) => (
              <Image
                key={user.id}
                source={{ uri: user.image }}
                style={[styles.avatar, { marginLeft: index !== 0 ? -12 : 0 }]}
              />
            ))}
            {bookedUsers.length > 3 && (
              <View style={styles.moreAvatar}>
                <Text style={styles.moreText}>+{bookedUsers.length - 3}</Text>
              </View>
            )}
            <View style={styles.rightContainer}>
              <View
                style={[
                  styles.filledSlots,
                  { backgroundColor: informationText },
                ]}>
                <Text style={[styles.filledSlotsText, { color: '#fff' }]}>
                  {bookedUsers.length}/
                  {event.meta.restrictions.max_participants} filled
                </Text>
              </View>
            </View>
          </View>

          {/* Event description with truncation and expand toggle */}
          <View
            style={[
              styles.descriptionContainer,
              {
                backgroundColor: backgroundColor,
                shadowColor: '#888',
              },
            ]}>
            <Text style={[styles.descriptionLabel, { color: textColor }]}>
              About The Event
            </Text>
            <Text
              style={[
                styles.eventDescription,
                { lineHeight: 22, color: textColor },
              ]}>
              {isDescriptionExpanded
                ? event.description
                : `${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''
                }`}
            </Text>
            {event.description.length > 150 && (
              <TouchableOpacity onPress={handleDescriptionToggle}>
                <Text style={styles.expandText}>
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <HostDetails host={host} loading={loading} />
          <TermsAndConditions />
          <CancellationPolicy />
        </View>
      </ScrollView>
      {/* Book Event button */}
      <View
        style={[
          styles.bottomBar,
          {
            // color: textColor,
          },
        ]}>
        <View style={styles.priceContainer}>
          <Ionicons name="cash-outline" size={20} color={textColor} />
          <View>
            <Text style={[styles.priceText, { color: textColor }]}>
              ₹{event.meta.price}
            </Text>
            <Text style={[styles.availabilityText, { color: 'green' }]}>
              Available
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.bookEventButton}
          onPress={handleBookEvent}>
          <Text style={styles.bookEventText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <TicketBookingModal
        isVisible={isModalVisible}
        maxTickets={50}
        pricePerTicket={event?.meta?.price ?? 0}
        onClose={() => setModalVisible(false)}
        onContinue={handleContinue}
      />

      {/* Razorpay WebView checkout — no native SDK needed */}
      <RazorpayWebModal
        isVisible={razorpayVisible}
        amount={paymentAmount}
        orderId={razorpayOrderId}
        razorpayKey={RAZORPAY_KEY}
        prefill={{
          name: user?.full_name ?? '',
          email: user?.email ?? '',
          contact: user?.phone_number ?? '',
        }}
        description={event?.title ?? 'Event Booking'}
        onSuccess={handlePaymentSuccess}
        onDismiss={handlePaymentDismiss}
        onError={handlePaymentError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconStyle: {
    marginRight: 5,
  },
  textStyle: {
    fontSize: 14,
  },
  divider: {
    height: 0.5,
    width: '100%',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  categoryTag: {
    marginLeft: 16,
    borderRadius: 4,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryView: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  approveRequestsContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 10,
  },
  approveRequestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  approvalList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  namesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  approvalName: {
    fontSize: 12,
  },
  othersText: {
    fontSize: 12,
    color: 'gray',
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  eventDetails: {
    marginLeft: 16,
    marginBottom: 10,
  },
  addressTextContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTime: {
    fontSize: 16,
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    marginRight: 15,
  },
  filledSlots: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  filledSlotsText: {
    fontSize: 14,
  },
  eventCity: {
    fontSize: 16,
    marginLeft: 8,
    marginRight: 50,
  },
  eventAgeLimit: {
    fontSize: 16,
    marginLeft: 8,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: 50,
  },
  moreAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  moreText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  descriptionContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 10,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
    marginRight: 5,
  },
  expandText: {
    color: primaryColor.main,
    fontSize: 16,
    marginTop: 5,
  },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  locationLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationImage: {
    width: 'auto',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  availabilityText: {
    fontSize: 12,
    marginLeft: 5,
  },

  bookEventButton: {
    backgroundColor: primaryColor.main,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  bookEventText: {
    color: primaryColor.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetailScreen;
