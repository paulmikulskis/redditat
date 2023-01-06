from pprint import pprint
import json
from typing import cast
from tweety.bot import Twitter
from tweety.types import twDataTypes, usertweet
import asyncio
from prisma import Prisma



async def main() -> None:
    db = Prisma()
    #await db.connect()

    app = Twitter("elonmusk")

    all_tweets = app.get_tweets()
    for tweet in all_tweets:
        id = tweet['id']
        id = await app.tweet_detail(id)
        detail = cast(twDataTypes.Tweet,id )
        
        print(json.dumps(detail.comments, indent=4, sort_keys=True, default=str))


    #await db.disconnect()


if __name__ == '__main__':
    #asyncio.run(main())
    pass