import api from './api';

const reviewService = {
  // Utwórz nową opinię
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas tworzenia opinii' };
    }
  },

  // Pobierz opinie dla jeziora
  getReviewsByLake: async (lakeId) => {
    try {
      const response = await api.get(`/reviews/lake/${lakeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania opinii' };
    }
  },

  // Pobierz moje opinie
  getMyReviews: async () => {
    try {
      const response = await api.get('/reviews/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania opinii' };
    }
  },

  // Zaktualizuj opinię
  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas aktualizacji opinii' };
    }
  },

  // Usuń opinię
  deleteReview: async (id) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas usuwania opinii' };
    }
  },

  // Admin: Pobierz wszystkie opinie
  getAllReviews: async (lakeId = null) => {
    try {
      const params = lakeId ? `?lakeId=${lakeId}` : '';
      const response = await api.get(`/reviews/admin/all${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania opinii' };
    }
  }
};

export default reviewService;
