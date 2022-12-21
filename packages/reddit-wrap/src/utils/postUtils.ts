import { Listing, RedditUser, Submission } from 'snoowrap'
import { load } from 'cheerio'
import axios from 'axios'

const KNOWN_IMAGE_DOMAINS = ['imgur.com', 'flickr.com', 'photobucket.com', 'instagram.com', '500px.com'];


export const getImgurUrl = async (url: string): Promise<string[] | undefined> => {
  // Make a GET request to the Imgur post URL
  const response = await axios.get(url);
  // Load the HTML into cheerio so we can use jQuery-like syntax to extract the image URL
  const $ = load(response.data);
  // Find the image element
  const imageElement = $('meta[property="og:image"]');
  // Extract the image URL from the element, and trim in case there 
  // are more URL params after the domain with image
  const imageUrl = (imageElement.attr('content') || '').split('?')[0]
  // Return the image URL
  return imageUrl ? [imageUrl] : undefined
}


export const submissionPointsToImageDomains = (submission: Submission) => {
  // Extract the domain from the URL
  const { hostname } = new URL(submission.url);
  // Check if the domain is in the array of known image domains
  return KNOWN_IMAGE_DOMAINS.includes(hostname);
}

export const submissionContainsImage = (submission: Submission): boolean => {
  const imageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif']
  const submissionUrl = submission.url
  if (submission.post_hint === 'image') return true
  return imageFileExtensions.some((extension) => submissionUrl.endsWith(extension))
}