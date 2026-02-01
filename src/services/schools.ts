// Mock Schools Service
import type { School, Class, DashboardStats } from '@/types';
import { mockSchools, mockClasses, mockStats } from './mockData';

let schools = [...mockSchools];

export const schoolsService = {
  async getSchools(): Promise<School[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return schools;
  },

  async getSchoolById(id: string): Promise<School | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return schools.find(s => s.id === id);
  },

  async getPendingSchools(): Promise<School[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return schools.filter(s => s.status === 'pending');
  },

  async approveSchool(id: string): Promise<School> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const school = schools.find(s => s.id === id);
    if (school) {
      school.status = 'approved';
    }
    return school!;
  },

  async suspendSchool(id: string): Promise<School> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const school = schools.find(s => s.id === id);
    if (school) {
      school.status = 'suspended';
    }
    return school!;
  },

  async getClasses(schoolId: string): Promise<Class[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClasses.filter(c => c.schoolId === schoolId);
  },

  async createClass(data: Partial<Class>): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClass: Class = {
      id: `class-${Date.now()}`,
      schoolId: data.schoolId || '',
      name: data.name || '',
      grade: data.grade || '',
      teacherId: data.teacherId,
      studentCount: 0,
      assignedCourses: [],
    };
    return newClass;
  },

  async getStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  },
};
