// Module service for fetching and managing modules

/**
 * Fetch user modules from the API
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of user modules
 */
export const fetchUserModules = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user/${userId}/modules`);
    if (!response.ok) {
      throw new Error('Failed to fetch user modules');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user modules:', error);
    return [];
  }
};

/**
 * Generate a personalized module
 * @param {string} userId - The user ID
 * @param {string} topic - The module topic
 * @param {string} level - The difficulty level
 * @returns {Promise<Object>} - The generated module
 */
export const generatePersonalizedModule = async (userId, topic, level) => {
  try {
    const response = await fetch('http://localhost:8080/api/generate-module', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        topic,
        level,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate personalized module');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating personalized module:', error);
    throw error;
  }
};