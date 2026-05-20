const FALLBACK_LISTING_IMAGE = "/images/1718130801032_hero-real-estate-facts-trends.jpeg";
export const FALLBACK_AVATAR_IMAGE = "/images/default-avatar.svg";

export const getLocalImageUrl = (imageUrl, fallback = FALLBACK_LISTING_IMAGE) => {
  if (!imageUrl) {
    return fallback;
  }

  if (imageUrl.startsWith("/images/")) {
    return imageUrl;
  }

  if (imageUrl.includes("firebasestorage.googleapis.com")) {
    const match = imageUrl.match(/\/o\/([^?]+)/);
    if (!match) {
      return fallback;
    }

    const fileName = decodeURIComponent(match[1]).split("/").pop();
    return fileName ? `/images/${fileName}` : fallback;
  }

  return imageUrl;
};

export const getAvatarImageUrl = (imageUrl) =>
  getLocalImageUrl(imageUrl, FALLBACK_AVATAR_IMAGE);
