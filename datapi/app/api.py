from typing import List, cast, Any
from fastapi import FastAPI, HTTPException
from tweety.bot import Twitter
from tweety.exceptions_ import UserNotFound, InvalidTweetIdentifier
from tweety.types import twDataTypes, usertweet
app = FastAPI()


def expand_comments(tweet):
    """
    Recursively expand the comments for a tweet.
    
    Parameters:
    - tweet (tweet): The tweet object to expand comments for.
    
    Returns:
    - A dictionary representing the tweet, with the comments field expanded to include all comments on the tweet and its comments, recursively.
    
    Raises:
    - None
    """
    tweet_dict = tweet.to_dict()
    comments = [expand_comments(twe) for twe in tweet.comments]
    tweet_dict["comments"] = comments
    return tweet_dict
    

@app.get("/tweets")
def get_tweets(
    handle: str,
    ntweets: int = 1,
    pages: int = 1,
    extended: bool = True,
):
    """
    Retrieve tweets from a specified user.
    
    Parameters:
    - handle (str): The Twitter handle of the user to retrieve tweets from.
    - ntweets (int, optional): The number of tweets to retrieve. Defaults to 1.
    - pages (int, optional): The number of pages of tweets to retrieve. Defaults to 1.
    - extended (bool, optional): Whether to include detailed information about the tweets. Defaults to True.
    
    Returns:
    - A list of dictionaries representing the retrieved tweets
    
    Raises:
    - HTTPException:
      - If handle is not provided.
      - If the specified user cannot be found.
      - If an unexpected error occurs while processing the request.
    """
    if not handle:
        raise HTTPException(status_code=400, detail="Handle is required.")

    rendered_tweets = []
    try:
        twitter_api = Twitter(handle)
        tweets: usertweet.UserTweets = cast(
            usertweet.UserTweets, twitter_api.get_tweets(pages)
        )
    except UserNotFound:
        raise HTTPException(
            status_code=404, detail=f"User '{handle}' not found."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred."
        ) from e

    for tweet in tweets[:ntweets]:
        try:
            detailed_tweet = cast(
                twDataTypes.Tweet, twitter_api.tweet_detail(tweet["id"])
            ) if extended else tweet
            detailed_tweet_data = detailed_tweet.to_dict()
            detailed_tweet_data["comments"] = [
                expand_comments(com) for com in (detailed_tweet if extended else tweet).comments # type: ignore
            ] if extended else []
            rendered_tweets.append(detailed_tweet_data)
        except InvalidTweetIdentifier:
            raise HTTPException(
                status_code=404, detail=f"Tweet '{tweet['id']}' not found."
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail="An unexpected error occurred."
            ) from e

    return rendered_tweets


@app.get("/user")
def get_user(
    handle: str,
):
    """
    Retrieve details about a Twitter user.
    
    Parameters:
    - handle (str): The Twitter handle of the user to retrieve details for.
    
    Returns:
    - A dictionary representing the user
    
    Raises:
    - HTTPException:
      - If handle is not provided.
      - If the specified user cannot be found.
      - If an unexpected error occurs while processing the request.
    """
    # Return a HTTP 400 response if the "handle" parameter is not provided
    if not handle:
        raise HTTPException(status_code=400, detail="Handle is required.")

    # Try to retrieve the user details from the Twitter API
    try:
        twitter_api = Twitter(handle)
        tuser: twDataTypes.User = cast(
            twDataTypes.User, twitter_api.get_user_info()
        )
    # If the user is not found, return a HTTP 404 response
    except UserNotFound:
        raise HTTPException(
            status_code=404, detail=f"User '{handle}' not found."
        )
    # If any other unexpected errors occur, return a HTTP 500 response
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred."
        ) from e

    # Return the user details if everything went smoothly
    return tuser
