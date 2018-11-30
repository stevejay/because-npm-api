// tslint:disable:max-line-length
import * as messageParser from "./message-parser";

describe("parseTwitterWebhookMessage", () => {
  test.each([
    [
      {
        for_user_id: "9999999999999999999",
        tweet_create_events: [
          {
            created_at: "Thu Oct 18 07:36:44 +0000 2018",
            id: 1.0528257941443e18,
            id_str: "1052825794144337920",
            text: "@BecauseNpm test tweet",
            truncated: false,
            in_reply_to_status_id: null,
            in_reply_to_status_id_str: null,
            in_reply_to_user_id: 1.034797758107e18,
            in_reply_to_user_id_str: "9999999999999999999",
            in_reply_to_screen_name: "BecauseNpm",
            user: {
              id: 2359714072,
              id_str: "2359714072",
              name: "joseph holder",
              screen_name: "JosephKl95",
              location: null,
              url: null,
              description: null,
              translator_type: "none",
              protected: false,
              verified: false,
              followers_count: 6,
              friends_count: 125,
              listed_count: 1,
              favourites_count: 1,
              statuses_count: 3,
              created_at: "Sat Feb 22 23:37:29 +0000 2014",
              utc_offset: null,
              time_zone: null,
              geo_enabled: false,
              lang: "en-GB",
              contributors_enabled: false,
              is_translator: false,
              profile_background_color: "C0DEED",
              profile_background_image_url:
                "http://abs.twimg.com/images/themes/theme1/bg.png",
              profile_background_image_url_https:
                "https://abs.twimg.com/images/themes/theme1/bg.png",
              profile_background_tile: false,
              profile_link_color: "1DA1F2",
              profile_sidebar_border_color: "C0DEED",
              profile_sidebar_fill_color: "DDEEF6",
              profile_text_color: "333333",
              profile_use_background_image: true,
              profile_image_url:
                "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              profile_image_url_https:
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              default_profile: true,
              default_profile_image: false,
              following: null,
              follow_request_sent: null,
              notifications: null
            },
            geo: null,
            coordinates: null,
            place: null,
            contributors: null,
            is_quote_status: false,
            quote_count: 0,
            reply_count: 0,
            retweet_count: 0,
            favorite_count: 0,
            entities: {
              hashtags: [],
              urls: [],
              user_mentions: [
                {
                  screen_name: "BecauseNpm",
                  name: "BecauseNpm",
                  id: 1.034797758107e18,
                  id_str: "9999999999999999999",
                  indices: [0, 11]
                }
              ],
              symbols: []
            },
            favorited: false,
            retweeted: false,
            filter_level: "low",
            lang: "fr",
            timestamp_ms: "1539848204538"
          }
        ]
      },
      []
    ],
    [
      {
        for_user_id: "9999999999999999999",
        tweet_create_events: [
          {
            created_at: "Thu Oct 18 07:36:44 +0000 2018",
            id: 1.0528257941443e18,
            id_str: "1052825794144337920",
            text: "@BecauseNpm foo to bar because this",
            truncated: false,
            in_reply_to_status_id: null,
            in_reply_to_status_id_str: null,
            in_reply_to_user_id: 1.034797758107e18,
            in_reply_to_user_id_str: "9999999999999999999",
            in_reply_to_screen_name: "BecauseNpm",
            user: {
              id: 2359714072,
              id_str: "2359714072",
              name: "joseph holder",
              screen_name: "JosephKl95",
              location: null,
              url: null,
              description: null,
              translator_type: "none",
              protected: false,
              verified: false,
              followers_count: 6,
              friends_count: 125,
              listed_count: 1,
              favourites_count: 1,
              statuses_count: 3,
              created_at: "Sat Feb 22 23:37:29 +0000 2014",
              utc_offset: null,
              time_zone: null,
              geo_enabled: false,
              lang: "en-GB",
              contributors_enabled: false,
              is_translator: false,
              profile_background_color: "C0DEED",
              profile_background_image_url:
                "http://abs.twimg.com/images/themes/theme1/bg.png",
              profile_background_image_url_https:
                "https://abs.twimg.com/images/themes/theme1/bg.png",
              profile_background_tile: false,
              profile_link_color: "1DA1F2",
              profile_sidebar_border_color: "C0DEED",
              profile_sidebar_fill_color: "DDEEF6",
              profile_text_color: "333333",
              profile_use_background_image: true,
              profile_image_url:
                "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              profile_image_url_https:
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              default_profile: true,
              default_profile_image: false,
              following: null,
              follow_request_sent: null,
              notifications: null
            },
            geo: null,
            coordinates: null,
            place: null,
            contributors: null,
            is_quote_status: false,
            quote_count: 0,
            reply_count: 0,
            retweet_count: 0,
            favorite_count: 0,
            entities: {
              hashtags: [],
              urls: [],
              user_mentions: [
                {
                  screen_name: "BecauseNpm",
                  name: "BecauseNpm",
                  id: 1.034797758107e18,
                  id_str: "9999999999999999999",
                  indices: [0, 11]
                }
              ],
              symbols: []
            },
            favorited: false,
            retweeted: false,
            filter_level: "low",
            lang: "fr",
            timestamp_ms: "1539848204538"
          }
        ]
      },
      [
        {
          id: "1052825794144337920",
          text: "@BecauseNpm foo to bar because this",
          creatorId: "2359714072",
          creatorUsername: "JosephKl95",
          timestampMs: "1539848204000"
        }
      ]
    ],
    [
      {
        for_user_id: "9999999999999999999",
        tweet_create_events: [
          {
            created_at: "Mon Nov 05 22:08:35 +0000 2018",
            id: 1.0595681835464e18,
            id_str: "1059568183546396674",
            text:
              "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tre\u2026 https://t.co/LXgR1Cgcbb",
            truncated: true,
            in_reply_to_status_id: null,
            in_reply_to_status_id_str: null,
            in_reply_to_user_id: 1.034797758107e18,
            in_reply_to_user_id_str: "9999999999999999999",
            in_reply_to_screen_name: "BecauseNpm",
            user: {
              id: 1.034797758107e18,
              id_str: "9999999999999999999",
              name: "BecauseNpm",
              screen_name: "BecauseNpm",
              location: null,
              url: null,
              description: null,
              translator_type: "none",
              protected: false,
              verified: false,
              followers_count: 0,
              friends_count: 1,
              listed_count: 0,
              favourites_count: 1,
              statuses_count: 8,
              created_at: "Wed Aug 29 13:39:45 +0000 2018",
              utc_offset: null,
              time_zone: null,
              geo_enabled: false,
              lang: "en",
              contributors_enabled: false,
              is_translator: false,
              profile_background_color: "F5F8FA",
              profile_background_image_url: "",
              profile_background_image_url_https: "",
              profile_background_tile: false,
              profile_link_color: "1DA1F2",
              profile_sidebar_border_color: "C0DEED",
              profile_sidebar_fill_color: "DDEEF6",
              profile_text_color: "333333",
              profile_use_background_image: true,
              profile_image_url:
                "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              profile_image_url_https:
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
              default_profile: true,
              default_profile_image: false,
              following: null,
              follow_request_sent: null,
              notifications: null
            },
            geo: null,
            coordinates: null,
            place: null,
            contributors: null,
            is_quote_status: false,
            extended_tweet: {
              full_text:
                "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tree. Largely a drop-in replacement. Test",
              display_text_range: [0, 153],
              entities: {
                hashtags: [],
                urls: [],
                user_mentions: [
                  {
                    screen_name: "BecauseNpm",
                    name: "BecauseNpm",
                    id: 1.034797758107e18,
                    id_str: "9999999999999999999",
                    indices: [0, 11]
                  }
                ],
                symbols: []
              }
            },
            quote_count: 0,
            reply_count: 0,
            retweet_count: 0,
            favorite_count: 0,
            entities: {
              hashtags: [],
              urls: [
                {
                  url: "https://t.co/LXgR1Cgcbb",
                  expanded_url:
                    "https://twitter.com/i/web/status/1059568183546396674",
                  display_url: "twitter.com/i/web/status/1\u2026",
                  indices: [117, 140]
                }
              ],
              user_mentions: [
                {
                  screen_name: "BecauseNpm",
                  name: "BecauseNpm",
                  id: 1.034797758107e18,
                  id_str: "9999999999999999999",
                  indices: [0, 11]
                }
              ],
              symbols: []
            },
            favorited: false,
            retweeted: false,
            filter_level: "low",
            lang: "en",
            timestamp_ms: "1541455715439"
          }
        ]
      },
      [
        {
          id: "1059568183546396674",
          text:
            "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tree. Largely a drop-in replacement. Test",
          creatorId: "9999999999999999999",
          creatorUsername: "BecauseNpm",
          timestampMs: "1541455715000"
        }
      ]
    ]
  ])("should parse %o as %o", (response, expected) => {
    const actual = messageParser.parseTwitterWebhookMessage(response);
    expect(actual).toEqual(expected);
  });
});
