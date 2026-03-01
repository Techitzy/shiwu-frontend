import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: number;
  name: string;
}

const sampleUsers: User[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Brown' },
  { id: 5, name: 'Tom Clark' },
  { id: 6, name: 'Tina Adams' },
  { id: 7, name: 'Mike Davis' },
  { id: 8, name: 'Nancy Green' },
  { id: 9, name: 'Lucy Lopez' },
  { id: 10, name: 'Charles Lee' },
];

const ManageUsersScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === sampleUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sampleUsers.map(user => user.id));
    }
  };

  const handleDelete = () => {
    if (selectedUsers.length === 0) return;
    
    // Alert.alert(
      //   'Delete Users',
      //   `Are you sure you want to delete ${selectedUsers.length} user(s)?`,
    //   [
      //     { text: 'Cancel', style: 'cancel' },
      //     {
        //       text: 'Delete',
        //       style: 'destructive',
        //       onPress: () => {
          //         console.log('Deleting users:', selectedUsers);
          //         setSelectedUsers([]);
          //       },
          //     },
          //   ]
          // );
          router.back()
  };

  const handleConfirm = () => {
    if (selectedUsers.length === 0) return;
    
    // Alert.alert(
    //   'Confirm Selection',
    //   `You have selected ${selectedUsers.length} user(s).`,
    //   [
    //     { text: 'OK', onPress: () => setSelectedUsers([]) },
    //   ]
    // );

    router.back()
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.includes(item.id);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.userRow,
          pressed && styles.userRowPressed,
        ]}
        onPress={() => toggleUserSelection(item.id)}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Manage Users</Text>

        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
          onPress={toggleSelectAll}>
          <Text style={styles.selectAllText}>Select All</Text>
        </Pressable>
      </View>

      {/* User List */}
      <FlatList
        data={sampleUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.actionButtonPressed,
            selectedUsers.length === 0 && styles.actionButtonDisabled,
          ]}
          onPress={handleDelete}
          disabled={selectedUsers.length === 0}>
          <Text
            style={[
              styles.deleteButtonText,
              selectedUsers.length === 0 && styles.actionButtonTextDisabled,
            ]}>
            Delete ({selectedUsers.length})
          </Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.confirmButton,
            pressed && styles.actionButtonPressed,
            selectedUsers.length === 0 && styles.actionButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={selectedUsers.length === 0}>
          <Text
            style={[
              styles.confirmButtonText,
              selectedUsers.length === 0 && styles.actionButtonTextDisabled,
            ]}>
            Confirm ({selectedUsers.length})
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  selectAllText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  userRowPressed: {
    backgroundColor: '#1a1a1a',
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  deleteButton: {
    backgroundColor: '#000000',
  },
  confirmButton: {
    backgroundColor: '#000000',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonTextDisabled: {
    opacity: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: '#1a1a1a',
  },
});

export default ManageUsersScreen;
