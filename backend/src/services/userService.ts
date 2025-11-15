import { User } from '../types';

// Sample data - in production, this would come from a database
const sampleUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

export const getAllUsers = (): User[] => {
  return sampleUsers;
};

export const getUserById = (id: string): User | undefined => {
  return sampleUsers.find((user) => user.id === id);
};

export const createUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: String(sampleUsers.length + 1),
    ...userData,
  };
  sampleUsers.push(newUser);
  return newUser;
};

