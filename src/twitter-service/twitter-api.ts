import Twit from "twit";

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY || "",
  consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET_KEY || "",
  app_only_auth: true
});

export async function getTweetById(id: string) {
  return await T.get("statuses/show/:id", { id, tweet_mode: "extended" });
}
