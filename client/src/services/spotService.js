import api from './api';

const spotService = {
  // Pobierz stanowiska dla jeziora
  getSpotsByLake: async (lakeId) => {
    try {
      const response = await api.get(`/spots/lake/${lakeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobierz stanowisko po ID
  getSpotById: async (id) => {
    try {
      const response = await api.get(`/spots/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobierz wszystkie stanowiska (admin)
  getAllSpots: async () => {
    try {
      const response = await api.get('/spots');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Utwórz nowe stanowisko (admin)
  createSpot: async (spotData) => {
    try {
      const response = await api.post('/spots', spotData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Zaktualizuj stanowisko (admin)
  updateSpot: async (id, spotData) => {
    try {
      const response = await api.put(`/spots/${id}`, spotData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Usuń stanowisko (admin)
  deleteSpot: async (id) => {
    try {
      const response = await api.delete(`/spots/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default spotService;
