import api from './api';

const reservationService = {
  // Utwórz nową rezerwację
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas tworzenia rezerwacji' };
    }
  },

  // Pobierz moje rezerwacje
  getMyReservations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.upcoming) queryParams.append('upcoming', 'true');

      const response = await api.get(`/reservations/my?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania rezerwacji' };
    }
  },

  // Pobierz pojedynczą rezerwację
  getReservationById: async (id) => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania rezerwacji' };
    }
  },

  // Anuluj rezerwację
  cancelReservation: async (id) => {
    try {
      const response = await api.put(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas anulowania rezerwacji' };
    }
  },

  // Pobierz zajęte daty dla stanowiska
  getReservedDates: async (spotId, startDate, endDate) => {
    try {
      const response = await api.get(`/reservations/spot/${spotId}/reserved-dates`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania zajętych dat' };
    }
  },

  // Pobierz zarezerwowane stanowiska dla jeziora w danym dniu (PUBLIC)
  getReservedSpotsForDate: async (lakeId, date) => {
    try {
      // Format daty: YYYY-MM-DD
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      const response = await api.get(`/reservations/lake/${lakeId}/date/${dateStr}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania dostępności' };
    }
  },

  // Admin: Pobierz wszystkie rezerwacje
  getAllReservations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.lakeId) queryParams.append('lakeId', params.lakeId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get(`/reservations/admin/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Błąd podczas pobierania rezerwacji' };
    }
  }
};

export default reservationService;
