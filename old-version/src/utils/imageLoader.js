// Load all images from the assets/images directory
const images = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg,gif,webp}', { eager: true, as: 'url' });

const imageUrls = Object.values(images);

/**
 * Returns a single random image URL.
 * @returns {string} Image URL
 */
export const getRandomImage = () => {
    if (imageUrls.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
};

/**
 * Returns a specified number of unique random image URLs.
 * If the count is greater than the available images, it will loop or reuse images.
 * @param {number} count - Number of images to return
 * @returns {string[]} Array of image URLs
 */
export const getRandomImages = (count) => {
    if (imageUrls.length === 0) return [];
    
    // Shuffle the array significantly
    const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
    
    // If we need more images than available, we concatenate the shuffled array
    while (shuffled.length < count) {
        shuffled.push(...shuffled);
    }
    
    return shuffled.slice(0, count);
};
