import api from './api';

const lakeService = {
  // Pobierz wszystkie jeziora
  getAllLakes: async () => {
    try {
      const response = await api.get('/lakes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobierz jezioro po ID ze stanowiskami
  getLakeById: async (id) => {
    try {
      const response = await api.get(`/lakes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Utwórz nowe jezioro (admin)
  createLake: async (lakeData) => {
    try {
      const response = await api.post('/lakes', lakeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Zaktualizuj jezioro (admin)
  updateLake: async (id, lakeData) => {
    try {
      const response = await api.put(`/lakes/${id}`, lakeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Usuń jezioro (admin)
  deleteLake: async (id) => {
    try {
      const response = await api.delete(`/lakes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload obrazu jeziora (admin)
  uploadImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post(`/lakes/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default lakeService;
