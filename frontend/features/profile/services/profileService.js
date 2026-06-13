export const profileService = {
  async getProfile() {
    return {
      name: 'Aarav Mehta',
      email: 'aarav@example.com',
      role: 'Frontend Engineer',
      location: 'Bengaluru, India',
      stats: { interviews: 18, averageScore: 82, resumesReviewed: 4 },
    };
  },
  async updateProfile(profile) {
    return profile;
  },
};
