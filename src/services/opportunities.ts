import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Opportunity } from '@/types';

const COLLECTION_NAME = 'opportunities';

export const opportunitiesService = {
  // Get all active opportunities (public)
  async getActiveOpportunities(): Promise<Opportunity[]> {
    try {
      // Try with index first
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Opportunity[];
      } catch (indexError: any) {
        // If index doesn't exist, fall back to client-side filtering
        console.warn('Firestore index not found, using client-side filtering:', indexError.message);
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        const allOpportunities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Opportunity[];
        
        // Filter and sort on client side
        return allOpportunities
          .filter(opp => opp.isActive)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
    } catch (error) {
      console.error('Error fetching active opportunities:', error);
      throw error;
    }
  },

  // Get all opportunities (admin only)
  async getAllOpportunities(): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Opportunity[];
    } catch (error) {
      console.error('Error fetching all opportunities:', error);
      throw error;
    }
  },

  // Get opportunity by ID
  async getOpportunityById(id: string): Promise<Opportunity | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Opportunity;
      }
      return null;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      throw error;
    }
  },

  // Create new opportunity (admin only)
  async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  },

  // Update opportunity (admin only)
  async updateOpportunity(id: string, data: Partial<Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  },

  // Delete opportunity (admin only)
  async deleteOpportunity(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw error;
    }
  },

  // Toggle opportunity active status (admin only)
  async toggleOpportunityStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling opportunity status:', error);
      throw error;
    }
  },
};
