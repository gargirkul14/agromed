import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SEED_DATA } from '../prisma/seed.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

let isPostgresConnected = false;

// In-Memory store for offline/teacher-presentation mode
class MockDatabase {
  constructor() {
    this.users = [];
    this.farmerProfiles = [];
    this.workProfiles = [];
    this.healthAssessments = [];
    this.chatHistories = [];
    this.safetyArticles = [];
    this.chemicalSafeties = [];
    this.pendingRegistrations = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Seed admin
    const adminHash = await bcrypt.hash(SEED_DATA.admin.password, 10);
    const adminId = 'admin-uuid-0001';
    this.users.push({
      id: adminId,
      name: SEED_DATA.admin.name,
      email: SEED_DATA.admin.email,
      password: adminHash,
      phone: SEED_DATA.admin.phone,
      role: 'ADMIN',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed demo farmer
    const farmerHash = await bcrypt.hash(SEED_DATA.demoFarmer.user.password, 10);
    const farmerUserId = 'farmer-uuid-0001';
    const farmerProfileId = 'profile-uuid-0001';
    const workProfileId = 'work-uuid-0001';

    this.users.push({
      id: farmerUserId,
      name: SEED_DATA.demoFarmer.user.name,
      email: SEED_DATA.demoFarmer.user.email,
      password: farmerHash,
      phone: SEED_DATA.demoFarmer.user.phone,
      role: 'FARMER',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.farmerProfiles.push({
      id: farmerProfileId,
      userId: farmerUserId,
      ...SEED_DATA.demoFarmer.profile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.workProfiles.push({
      id: workProfileId,
      farmerId: farmerProfileId,
      ...SEED_DATA.demoFarmer.workProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed assessments
    SEED_DATA.demoFarmer.assessments.forEach((ass, idx) => {
      this.healthAssessments.push({
        id: `assessment-uuid-000${idx + 1}`,
        farmerId: farmerProfileId,
        ...ass,
        createdAt: ass.createdAt || new Date()
      });
    });

    // Seed articles
    SEED_DATA.articles.forEach((art, idx) => {
      this.safetyArticles.push({
        id: `article-uuid-000${idx + 1}`,
        ...art,
        createdAt: new Date(Date.now() - (idx * 2) * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    });

    // Seed chemicals
    SEED_DATA.chemicals.forEach((chem, idx) => {
      this.chemicalSafeties.push({
        id: `chemical-uuid-000${idx + 1}`,
        ...chem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    console.log('✓ AgroMed Presentation Store initialized with complete demo data.');
  }

  // Model helpers
  get user() {
    return {
      findUnique: async ({ where }) => {
        return this.users.find(u => (where.id && u.id === where.id) || (where.email && u.email.toLowerCase() === where.email.toLowerCase())) || null;
      },
      findFirst: async ({ where = {} } = {}) => {
        return this.users.find(u => {
          if (where.email && u.email.toLowerCase() !== where.email.toLowerCase()) return false;
          if (where.phone && u.phone !== where.phone) return false;
          if (where.id && u.id !== where.id) return false;
          return true;
        }) || null;
      },
      findMany: async ({ where = {}, include = {} } = {}) => {
        let list = this.users;
        if (where.role) list = list.filter(u => u.role === where.role);
        return list.map(u => {
          const res = { ...u };
          if (include.farmerProfile) {
            res.farmerProfile = this.farmerProfiles.find(p => p.userId === u.id) || null;
            if (res.farmerProfile && include.farmerProfile.include?.workProfile) {
              res.farmerProfile.workProfile = this.workProfiles.find(w => w.farmerId === res.farmerProfile.id) || null;
            }
          }
          return res;
        });
      },
      create: async ({ data }) => {
        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || null,
          role: data.role || 'FARMER',
          isEmailVerified: data.isEmailVerified !== undefined ? data.isEmailVerified : false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
      },
      update: async ({ where, data }) => {
        const user = await this.user.findUnique({ where });
        if (!user) throw new Error('User not found');
        Object.assign(user, data, { updatedAt: new Date() });
        return user;
      },
      count: async ({ where = {} } = {}) => {
        let list = this.users;
        if (where.role) list = list.filter(u => u.role === where.role);
        return list.length;
      }
    };
  }

  get pendingRegistration() {
    return {
      findUnique: async ({ where }) => {
        return this.pendingRegistrations.find(p => (where.id && p.id === where.id) || (where.email && p.email.toLowerCase() === where.email.toLowerCase())) || null;
      },
      findFirst: async ({ where = {} } = {}) => {
        return this.pendingRegistrations.find(p => {
          if (where.email && p.email.toLowerCase() !== where.email.toLowerCase()) return false;
          if (where.id && p.id !== where.id) return false;
          return true;
        }) || null;
      },
      create: async ({ data }) => {
        const item = {
          id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          email: data.email.toLowerCase().trim(),
          name: data.name,
          password: data.password,
          phone: data.phone || null,
          otpHash: data.otpHash,
          expiresAt: new Date(data.expiresAt),
          attempts: data.attempts || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.pendingRegistrations.push(item);
        return item;
      },
      update: async ({ where, data }) => {
        const item = await this.pendingRegistration.findUnique({ where });
        if (!item) throw new Error('Pending registration not found');
        Object.assign(item, data, { updatedAt: new Date() });
        return item;
      },
      upsert: async ({ where, update, create }) => {
        const existing = await this.pendingRegistration.findUnique({ where });
        if (existing) {
          return this.pendingRegistration.update({ where, data: update });
        }
        return this.pendingRegistration.create({ data: create });
      },
      delete: async ({ where }) => {
        const idx = this.pendingRegistrations.findIndex(p => (where.id && p.id === where.id) || (where.email && p.email.toLowerCase() === where.email.toLowerCase()));
        if (idx !== -1) {
          const removed = this.pendingRegistrations.splice(idx, 1)[0];
          return removed;
        }
        return null;
      },
      deleteMany: async ({ where = {} } = {}) => {
        const before = this.pendingRegistrations.length;
        if (where.email) {
          this.pendingRegistrations = this.pendingRegistrations.filter(p => p.email.toLowerCase() !== where.email.toLowerCase());
        } else if (where.expiresAt && where.expiresAt.lt) {
          this.pendingRegistrations = this.pendingRegistrations.filter(p => p.expiresAt >= where.expiresAt.lt);
        } else {
          this.pendingRegistrations = [];
        }
        return { count: before - this.pendingRegistrations.length };
      }
    };
  }

  get farmerProfile() {
    return {
      findUnique: async ({ where, include = {} }) => {
        const profile = this.farmerProfiles.find(p => (where.id && p.id === where.id) || (where.userId && p.userId === where.userId)) || null;
        if (!profile) return null;
        const res = { ...profile };
        if (include.user) res.user = this.users.find(u => u.id === profile.userId) || null;
        if (include.workProfile) res.workProfile = this.workProfiles.find(w => w.farmerId === profile.id) || null;
        if (include.healthAssessments) res.healthAssessments = this.healthAssessments.filter(a => a.farmerId === profile.id);
        return res;
      },
      findFirst: async ({ where, include = {} }) => this.farmerProfile.findUnique({ where, include }),
      create: async ({ data }) => {
        const newProfile = {
          id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          profileCompleted: Boolean(data.age && data.village && data.state),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.farmerProfiles.push(newProfile);
        return newProfile;
      },
      update: async ({ where, data }) => {
        const profile = await this.farmerProfile.findUnique({ where });
        if (!profile) throw new Error('Farmer profile not found');
        Object.assign(profile, data, { updatedAt: new Date() });
        profile.profileCompleted = Boolean(profile.age && profile.village && profile.state);
        return profile;
      },
      upsert: async ({ where, update, create }) => {
        const existing = await this.farmerProfile.findUnique({ where });
        if (existing) return this.farmerProfile.update({ where, data: update });
        return this.farmerProfile.create({ data: create });
      },
      count: async () => this.farmerProfiles.length
    };
  }

  get workProfile() {
    return {
      findUnique: async ({ where }) => {
        return this.workProfiles.find(w => (where.id && w.id === where.id) || (where.farmerId && w.farmerId === where.farmerId)) || null;
      },
      findFirst: async ({ where }) => this.workProfile.findUnique({ where }),
      create: async ({ data }) => {
        const newWork = {
          id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.workProfiles.push(newWork);
        return newWork;
      },
      update: async ({ where, data }) => {
        const work = await this.workProfile.findUnique({ where });
        if (!work) throw new Error('Work profile not found');
        Object.assign(work, data, { updatedAt: new Date() });
        return work;
      },
      upsert: async ({ where, update, create }) => {
        const existing = await this.workProfile.findUnique({ where });
        if (existing) return this.workProfile.update({ where, data: update });
        return this.workProfile.create({ data: create });
      }
    };
  }

  get healthAssessment() {
    return {
      create: async ({ data }) => {
        const newAssessment = {
          id: `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          createdAt: new Date()
        };
        this.healthAssessments.unshift(newAssessment);
        return newAssessment;
      },
      findMany: async ({ where = {}, orderBy = {}, take, include = {} } = {}) => {
        let list = [...this.healthAssessments];
        if (where.farmerId) list = list.filter(a => a.farmerId === where.farmerId);
        if (where.riskLevel) list = list.filter(a => a.riskLevel === where.riskLevel);
        if (orderBy.createdAt === 'desc') {
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if (take) list = list.slice(0, take);
        return list.map(a => {
          const res = { ...a };
          if (include.farmer) {
            res.farmer = this.farmerProfiles.find(p => p.id === a.farmerId) || null;
            if (res.farmer && include.farmer.include?.user) {
              res.farmer.user = this.users.find(u => u.id === res.farmer.userId) || null;
            }
          }
          return res;
        });
      },
      findUnique: async ({ where }) => {
        return this.healthAssessments.find(a => a.id === where.id) || null;
      },
      findFirst: async ({ where = {}, orderBy = {} } = {}) => {
        const list = await this.healthAssessment.findMany({ where, orderBy, take: 1 });
        return list[0] || null;
      },
      count: async ({ where = {} } = {}) => {
        let list = this.healthAssessments;
        if (where.riskLevel) list = list.filter(a => a.riskLevel === where.riskLevel);
        return list.length;
      }
    };
  }

  get chatHistory() {
    return {
      create: async ({ data }) => {
        const newChat = {
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          createdAt: new Date()
        };
        this.chatHistories.push(newChat);
        return newChat;
      },
      findMany: async ({ where = {}, orderBy = {} } = {}) => {
        let list = [...this.chatHistories];
        if (where.farmerId) list = list.filter(c => c.farmerId === where.farmerId);
        if (orderBy.createdAt === 'asc') {
          list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return list;
      },
      deleteMany: async ({ where = {} } = {}) => {
        if (where.farmerId) {
          this.chatHistories = this.chatHistories.filter(c => c.farmerId !== where.farmerId);
        } else {
          this.chatHistories = [];
        }
        return { count: 1 };
      }
    };
  }

  get safetyArticle() {
    return {
      findMany: async ({ where = {}, orderBy = {} } = {}) => {
        let list = [...this.safetyArticles];
        if (where.category) list = list.filter(a => a.category.toLowerCase() === where.category.toLowerCase());
        if (where.OR) {
          // Search support
          const titleSearch = where.OR.find(o => o.title?.contains)?.title?.contains?.toLowerCase();
          const contentSearch = where.OR.find(o => o.content?.contains)?.content?.contains?.toLowerCase();
          list = list.filter(a => 
            (titleSearch && a.title.toLowerCase().includes(titleSearch)) || 
            (contentSearch && a.content.toLowerCase().includes(contentSearch))
          );
        }
        if (orderBy.createdAt === 'desc') {
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return list;
      },
      findUnique: async ({ where }) => {
        return this.safetyArticles.find(a => a.id === where.id) || null;
      },
      create: async ({ data }) => {
        const newArticle = {
          id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.safetyArticles.unshift(newArticle);
        return newArticle;
      },
      update: async ({ where, data }) => {
        const article = await this.safetyArticle.findUnique({ where });
        if (!article) throw new Error('Article not found');
        Object.assign(article, data, { updatedAt: new Date() });
        return article;
      },
      delete: async ({ where }) => {
        const idx = this.safetyArticles.findIndex(a => a.id === where.id);
        if (idx !== -1) this.safetyArticles.splice(idx, 1);
        return { id: where.id };
      },
      count: async () => this.safetyArticles.length
    };
  }

  get chemicalSafety() {
    return {
      findMany: async ({ orderBy = {} } = {}) => {
        const list = [...this.chemicalSafeties];
        if (orderBy.chemicalName === 'asc') {
          list.sort((a, b) => a.chemicalName.localeCompare(b.chemicalName));
        }
        return list;
      },
      findUnique: async ({ where }) => {
        return this.chemicalSafeties.find(c => (where.id && c.id === where.id) || (where.chemicalName && c.chemicalName.toLowerCase() === where.chemicalName.toLowerCase())) || null;
      },
      create: async ({ data }) => {
        const newChem = {
          id: `chem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.chemicalSafeties.push(newChem);
        return newChem;
      },
      update: async ({ where, data }) => {
        const chem = await this.chemicalSafety.findUnique({ where });
        if (!chem) throw new Error('Chemical not found');
        Object.assign(chem, data, { updatedAt: new Date() });
        return chem;
      },
      delete: async ({ where }) => {
        const idx = this.chemicalSafeties.findIndex(c => c.id === where.id);
        if (idx !== -1) this.chemicalSafeties.splice(idx, 1);
        return { id: where.id };
      },
      count: async () => this.chemicalSafeties.length
    };
  }
}

const mockDb = new MockDatabase();

// Connect and verify database on initialization
export async function initializeDatabase() {
  try {
    await prisma.$connect();
    // Test a basic query
    await prisma.user.count();
    isPostgresConnected = true;
    console.log('✅ [AgroMed DB] Connected to PostgreSQL via Prisma ORM!');
  } catch (err) {
    isPostgresConnected = false;
    console.log('⚠️ [AgroMed DB] PostgreSQL is not reachable at DATABASE_URL.');
    console.log('🚀 [AgroMed DB] Activating zero-setup Presentation Mode (with all seeded demo accounts & data).');
    await mockDb.init();
  }
}

// Proxied database client: automatically routes to Prisma if PostgreSQL is live, otherwise to MockDatabase
export const db = new Proxy({}, {
  get(target, prop) {
    if (isPostgresConnected) {
      return prisma[prop];
    }
    return mockDb[prop];
  }
});

export { prisma, isPostgresConnected };
